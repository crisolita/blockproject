// import * as ExcelJS from 'exceljs';
// import { Modales, PrismaClient, SubCategorias } from '@prisma/client';

// async function procesarExcel() {
//   const prisma = new PrismaClient();
//   const workbook = new ExcelJS.Workbook();

//   try {
//     await workbook.xlsx.readFile('/Users/crisolcova/blockproject/eventos.xlsx'); // Reemplaza con la ruta a tu archivo Excel

//     const worksheet = workbook.getWorksheet(1); // Suponiendo que los datos están en la primera hoja

//     worksheet?.eachRow(async (row, rowNumber) => {

//       const [undefined,name, place, date, modalidad, subcategoria, distancia] = row.values as string[] ;

//       // Crea un objeto de datos con los valores de la fila
//       const data = {
//         creator_id:3,
//         name,
//         place,
//         date:new Date(date),
//         modalidad:modalidad as Modales,
//         subcategoria:subcategoria as SubCategorias,
//         distancia: Number(distancia),
//       };
//       console.log(data)

//       try {
//         const nuevoEvento = await prisma.eventos.create({ data });
//         console.log(`Evento creado: ${nuevoEvento.name}`);
//       } catch (error) {
//         console.error(`Error al crear el evento en la fila ${rowNumber}: ${error}`);
//       }
//     });
//   } catch (error) {
//     console.error(`Error al leer el archivo Excel: ${error}`);
//   } finally {
//     await prisma.$disconnect(); // Cierra la conexión a la base de datos cuando hayas terminado
//   }
// }

// procesarExcel();