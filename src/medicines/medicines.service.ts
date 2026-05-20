import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository, } from 'typeorm';
import { Medicine, MedicineStatus } from './entities/medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { MedicineListDto } from './dto/medicine-list.dto';
import * as XLSX from 'xlsx';


import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


import { from as copyFrom } from 'pg-copy-streams';
import { Readable } from 'stream';


@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,  
    @InjectDataSource()                        // ← yeh add karo
    private readonly dataSource: DataSource,   // ← yeh add karo
  ) { }

  /** CREATE */
  async create(createMedicineDto: CreateMedicineDto, user: any) {
    try {
      const medicine = this.medicineRepo.create({ ...createMedicineDto, createdBy: { id: user.userId }, hospitalId: user.hospitalId });
      return this.medicineRepo.save(medicine);
    } catch (e) {
      console.log('issue in creating the medicine', e)
      throw (e)
    }
  }

  /** LIST ALL */
  async findAll(page: number = 1, limit: number = 10, user: any) {
    try {
      const skip = (page - 1) * limit;

      const [medicines, total] = await this.medicineRepo.findAndCount({
        where: { isActive: true, hospitalId: user.hospitalId },
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

      return {
        medicines,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (e) {
      console.log('Fetching the list of the medicine', e)
      throw (e)
    }
  }

  /** GET ONE */
  async findOne(id: number) {
    try {
      const medicine = await this.medicineRepo.findOne({
        where: { id },
      });

      if (!medicine) {
        throw new NotFoundException('Medicine not found');
      }

      return medicine;
    } catch (e) {
      console.log('throw error in find One api in medicine', e)
      throw (e)
    }
  }

  /** UPDATE */
  async update(id: number, updateMedicineDto: UpdateMedicineDto) {
    try {
      const medicine = await this.findOne(id);

      Object.assign(medicine, updateMedicineDto);
      return this.medicineRepo.save(medicine);
    } catch (e) {
      console.log('throw error in update api in medicine', e)
      throw (e)
    }
  }

  /** DELETE (Soft delete recommended) */
  async remove(id: number) {
    try {
      const medicine = await this.findOne(id);

      medicine.isActive = false;
      return this.medicineRepo.save(medicine);
    } catch (e) {
      console.log('Error in delting the medicine api', e)
      throw (e)
    }
  }

  async getCardCounts(user: any) {
    const totalMedicines = await this.medicineRepo.count({ where: { hospitalId: user.hospitalId } });

    const available = await this.medicineRepo.count({
      where: {
        status: MedicineStatus.AVAILABLE,
        hospitalId: user.hospitalId
      },
    });

    const lowStock = await this.medicineRepo.count({
      where: { status: MedicineStatus.LOW_STOCK, hospitalId: user.hospitalId },
    });

    const critical = await this.medicineRepo.count({
      where: { status: MedicineStatus.CRITICAL, hospitalId: user.hospitalId },
    });

    return {
      totalMedicines,
      available,
      lowStock,
      critical,
    };
  }

  // async uploadExcel(file: Express.Multer.File) {
  //   try {
  //     // Read excel buffer
  //     const workbook = XLSX.read(file.buffer, { type: 'buffer' });

  //     // First sheet
  //     const sheetName = workbook.SheetNames[0];

  //     // Sheet data
  //     const worksheet = workbook.Sheets[sheetName];

  //     // Convert to JSON
  //     const data = XLSX.utils.sheet_to_json(worksheet);

  //     for (const row of data as any[]) {
  //       // Find existing medicine
  //       const existingMedicine = await this.medicineRepo.findOne({
  //         where: {
  //           name: row.name,
  //           hospitalId: row.hospital_id,
  //         },
  //       });

  //       if (existingMedicine) {
  //         // Update existing row
  //         await this.medicineRepo.update(existingMedicine.id, {
  //           type: row.type,
  //           strength: row.strength,
  //           manufacturer: row.manufacturer,
  //           quantity: row.quantity,
  //           price: row.price,
  //           status: row.status,
  //           isActive: row.isActive,
  //           updatedAt: new Date(),
  //         });
  //       } else {
  //         // Create new row
  //         const medicine = this.medicineRepo.create({
  //           name: row.name,
  //           type: row.type,
  //           strength: row.strength,
  //           manufacturer: row.manufacturer,
  //           quantity: row.quantity,
  //           price: row.price,
  //           status: row.status,
  //           isActive: row.isActive,
  //           hospitalId: row.hospital_id,
  //           createdBy: row.created_by,
  //         });

  //         await this.medicineRepo.save(medicine);
  //       }
  //     }

  //     return {
  //       success: true,
  //       message: 'Excel uploaded successfully',
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
























  async uploadExcel(file: Express.Multer.File) {
  const totalStart = Date.now();

  try {
    // ── 1. Parse File ────────────────────────────────────────────
    const parseStart = Date.now();

    let data: any[] = [];
    const fileExt = file.originalname.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      const csvText = file.buffer.toString('utf-8');
      const lines = csvText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l !== '');

      const headers = lines[0]
        .replace(/^\uFEFF/, '')
        .split(',')
        .map(h => h.trim().replace(/^"|"$/g, ''));

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length !== headers.length) continue;
        const row: Record<string, any> = {};
        headers.forEach((h, idx) => (row[h] = values[idx]));
        data.push(row);
      }
    } else {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet);
    }

    console.log(`📄 Parsed: ${data.length} rows in ${Date.now() - parseStart}ms`);

    if (data.length === 0) throw new Error('No data found in file');

    // ── 2. Status map ────────────────────────────────────────────
    const statusMap: Record<string, MedicineStatus> = {
      'available': MedicineStatus.AVAILABLE,
      'lowstock':  MedicineStatus.LOW_STOCK,
      'low_stock': MedicineStatus.LOW_STOCK,
      'critical':  MedicineStatus.CRITICAL,
    };

    // ── 3. Sanitize rows ─────────────────────────────────────────
    const sanitized = data
      .filter(row => row.name && row.hospital_id) // required fields
      .map(row => ({
        name:         String(row.name).trim(),
        type:         String(row.type ?? '').trim(),
        strength:     String(row.strength ?? '').trim(),
        manufacturer: String(row.manufacturer ?? '').trim(),
        quantity:     Number(row.quantity) || 0,
        price:        parseFloat(Number(row.price).toFixed(2)),
        status:       statusMap[String(row.status ?? '').toLowerCase()] ?? MedicineStatus.AVAILABLE,
        isActive:     String(row.isActive).toLowerCase() === 'true',
        hospitalId:   Number(row.hospital_id),
        createdBy:    row.created_by ? { id: Number(row.created_by) } : null,
      }));

    console.log(`🧹 Sanitized: ${sanitized.length} valid rows (${data.length - sanitized.length} skipped)`);

    // ── 4. Chunk-wise Bulk Upsert ─────────────────────────────────
    // Single row insert instead of findOne+save = ~10x faster
    const CHUNK_SIZE = 1000; // 1000 rows per query
    let created = 0;
    let updated = 0;

    for (let i = 0; i < sanitized.length; i += CHUNK_SIZE) {
      const chunkStart = Date.now();
      const chunk: any[] = sanitized.slice(i, i + CHUNK_SIZE);

      // Bulk upsert — ON CONFLICT update karo
      const result = await this.medicineRepo
       .createQueryBuilder()
  .insert()
  .into(Medicine)
  .values(chunk)
  .orIgnore()  // conflict pe skip karo
  .execute();

      // Affected rows count
      const affected = result.raw?.length ?? chunk.length;
      created += affected;

      const elapsed = ((Date.now() - totalStart) / 1000).toFixed(1);
      const chunkTime = Date.now() - chunkStart;
      console.log(
        `⏳ Chunk ${Math.ceil((i + CHUNK_SIZE) / CHUNK_SIZE)}/${Math.ceil(sanitized.length / CHUNK_SIZE)} | Rows ${i + 1}-${Math.min(i + CHUNK_SIZE, sanitized.length)} | Chunk: ${chunkTime}ms | Elapsed: ${elapsed}s`
      );
    }

    const totalTime = ((Date.now() - totalStart) / 1000).toFixed(2);
    console.log(`✅ Done! ${sanitized.length} rows in ${totalTime}s`);

    return {
      success: true,
      message: 'File uploaded and processed successfully',
      summary: {
        totalRows:   data.length,
        processed:   sanitized.length,
        skipped:     data.length - sanitized.length,
        timeTaken:   `${totalTime}s`,
      },
    };
  } catch (error) {
    console.error(`❌ Upload failed after ${((Date.now() - totalStart) / 1000).toFixed(2)}s:`, error.message);
    throw error;
  }
}
















// async uploadExcel(file: Express.Multer.File) {
//   const totalStart = Date.now();

//   try {
//     // ── 1. Parse ──────────────────────────────────────────────────
//     const parseStart = Date.now();
//     let data: any[] = [];
//     const fileExt = file.originalname.split('.').pop()?.toLowerCase();

//     if (fileExt === 'csv') {
//       const csvText = file.buffer.toString('utf-8');
//       const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
//       const headers = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim().replace(/^"|"$/g, ''));
//       for (let i = 1; i < lines.length; i++) {
//         const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
//         if (values.length !== headers.length) continue;
//         const row: Record<string, any> = {};
//         headers.forEach((h, idx) => (row[h] = values[idx]));
//         data.push(row);
//       }
//     } else {
//       const workbook = XLSX.read(file.buffer, { type: 'buffer' });
//       data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
//     }
//     console.log(`📄 Parsed: ${data.length} rows in ${Date.now() - parseStart}ms`);
//     if (data.length === 0) throw new Error('No data found in file');

//     // ── 2. Sanitize ───────────────────────────────────────────────
//     const statusMap: Record<string, string> = {
//       'available': 'available',
//       'lowstock':  'lowstock',
//       'low_stock': 'lowstock',
//       'critical':  'critical',
//     };

//     const sanitized = data
//       .filter(row => row.name && row.hospital_id)
//       .map(row => ({
//         name:         String(row.name).trim().replace(/\t|\n|\r/g, ' '),
//         type:         String(row.type ?? '').trim(),
//         strength:     String(row.strength ?? '').trim(),
//         manufacturer: String(row.manufacturer ?? '').trim(),
//         quantity:     Number(row.quantity) || 0,
//         price:        parseFloat(Number(row.price).toFixed(2)),
//         status:       statusMap[String(row.status ?? '').toLowerCase()] ?? 'available',
//         isActive:     String(row.isActive).toLowerCase() === 'true',
//         hospitalId:   Number(row.hospital_id),
//         createdBy:    row.created_by ? Number(row.created_by) : null,
//       }));

//     console.log(`🧹 Sanitized: ${sanitized.length} rows`);

//     // ── 3. Pool se dedicated connection lo ───────────────────────
//     // Sab kuch EK hi connection pe hoga — temp table + COPY + upsert
//     const pool = (this.dataSource.driver as any).master;
//     const pgClient = await pool.connect(); // pool se dedicated client

//     try {
//       // ── 4. Temp table — same connection ──────────────────────
//       await pgClient.query(`
//         CREATE TEMP TABLE IF NOT EXISTS medicines_temp (
//           name          VARCHAR(150),
//           type          VARCHAR(50),
//           strength      VARCHAR(50),
//           manufacturer  VARCHAR(100),
//           quantity      INTEGER,
//           price         NUMERIC,
//           status        TEXT,
//           "isActive"    BOOLEAN,
//           hospital_id   INTEGER,
//           created_by    INTEGER
//         )
//       `);
//       await pgClient.query('TRUNCATE medicines_temp');
//       console.log(`🗄️  Temp table ready`);

//       // ── 5. TSV build ──────────────────────────────────────────
//       const tsvStart = Date.now();
//       const tsvString = sanitized
//         .map(row =>
//           [
//             row.name,
//             row.type         || '\\N',
//             row.strength     || '\\N',
//             row.manufacturer || '\\N',
//             row.quantity,
//             row.price,
//             row.status,
//             row.isActive,
//             row.hospitalId,
//             row.createdBy    ?? '\\N',
//           ].join('\t')
//         )
//         .join('\n') + '\n';
//       console.log(`📝 TSV built in ${Date.now() - tsvStart}ms`);

//       // ── 6. COPY — same pgClient ───────────────────────────────
//       const copyStart = Date.now();
//       await new Promise<void>((resolve, reject) => {
//         const stream = pgClient.query(
//           copyFrom(
//             `COPY medicines_temp (name, type, strength, manufacturer, quantity, price, status, "isActive", hospital_id, created_by)
//              FROM STDIN WITH (FORMAT text, DELIMITER E'\\t', NULL '\\N')`
//           )
//         );
//         const readable = Readable.from([tsvString]);
//         readable.pipe(stream);
//         stream.on('finish', resolve);
//         stream.on('error', reject);
//         readable.on('error', reject);
//       });
//       console.log(`COPY done in ${Date.now() - copyStart}ms`);

//       // ── 7. Upsert — same pgClient ─────────────────────────────
//       const upsertStart = Date.now();
//       const upsertResult = await pgClient.query(`
//   INSERT INTO public.medicines
//     (name, type, strength, manufacturer, quantity, price, status, "isActive", hospital_id, created_by, created_at, updated_at)
//   SELECT
//     name, type, strength, manufacturer, quantity, price,
//     status::medicines_status_enum,
//     "isActive", hospital_id, created_by,
//     NOW(), NOW()
//   FROM medicines_temp
//   ON CONFLICT DO NOTHING
// `);
//       console.log(`⚡ Upsert done in ${Date.now() - upsertStart}ms | Rows: ${upsertResult.rowCount}`);

//       const totalTime = ((Date.now() - totalStart) / 1000).toFixed(2);
//       console.log(`Total: ${sanitized.length} rows in ${totalTime}s`);

//       return {
//         success: true,
//         message: 'File uploaded successfully',
//         summary: {
//           totalRows:  data.length,
//           processed:  sanitized.length,
//           skipped:    data.length - sanitized.length,
//           timeTaken:  `${totalTime}s`,
//         },
//       };

//     } finally {
//       pgClient.release(); // pool mein wapas
//     }

//   } catch (error) {
//     console.error(`❌ Failed after ${((Date.now() - totalStart) / 1000).toFixed(2)}s:`, error.message);
//     throw error;
//   }
// }








}
