// utils/reports.js
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ReportGenerator = {
    generatePrestamosReport(data) {
        const docDefinition = {
            content: [
                { text: 'Reporte de Préstamos', style: 'header' },
                { text: `Fecha: ${new Date().toLocaleDateString()}`, margin: [0, 0, 0, 20] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', 'auto', 'auto'],
                        body: [
                            // Header
                            ['Usuario', 'Libro', 'Fecha Préstamo', 'Fecha Devolución'],
                            // Data rows
                            ...data.map(item => [
                                item.Usuario,
                                item.Titulo,
                                new Date(item.FechaPrestamo).toLocaleDateString(),
                                item.FechaDevolucionEsperada.toLocaleDateString()
                            ])
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                }
            }
        };

        return pdfMake.createPdf(docDefinition);
    },
  

generateDetailedReport(data, type) {
    const currentDate = new Date().toLocaleDateString();
    
    let content = [];
    
    // Add header
    content.push(
        { text: `Reporte de ${type}`, style: 'header' },
        { text: `Generado: ${currentDate}`, style: 'date' }
    );

    // Add summary
    if (type === 'prestamos') {
        const totalPrestamos = data.length;
        const prestamosActivos = data.filter(p => !p.FechaDevolucionReal).length;
        
        content.push(
            { text: 'Resumen', style: 'subheader' },
            {
                ul: [
                    `Total de préstamos: ${totalPrestamos}`,
                    `Préstamos activos: ${prestamosActivos}`,
                    `Préstamos devueltos: ${totalPrestamos - prestamosActivos}`
                ]
            }
        );
    }
    // Add main table
    content.push({
        table: {
            headerRows: 1,
            widths: ['*', '*', 'auto', 'auto'],
            body: [
                // Headers
                ['Usuario', 'Libro', 'Fecha Préstamo', 'Estado'],
                // Data
                ...data.map(item => [
                    item.Usuario,
                    item.Titulo,
                    new Date(item.FechaPrestamo).toLocaleDateString(),
                    item.FechaDevolucionReal ? 'Devuelto' : 'Activo'
                ])
            ]
        }
    });

    return pdfMake.createPdf({
        content,
        styles: reportStyles[type],
        defaultStyle: {
            font: 'Helvetica'
        }
   
    });
   }    

}  
    export default ReportGenerator;





