import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-case1',
  templateUrl: './case1.component.html',
  styleUrls: ['./case1.component.css'],
})
export class Case1Component implements OnInit {
  report = {
    laptopReport1: {
      summaryList: {
        'Front Desk': [
          {
            question: '22',
            answer: 'Yes',
            remark: 'remark 3',
          },
          {
            question: '23',
            answer: 'Yes',
            remark: 'remark 4',
          },
          {
            question: '32',
            answer: 'Yes',
            remark: 'remark 3',
          },
          {
            question: '33',
            answer: 'Yes',
            remark: 'remark 4',
          },
        ],
        'Waiting Area': [
          {
            question: '20',
            answer: 'Yes',
            remark: 'remark 1',
          },
          {
            question: '21',
            answer: 'No',
            remark: 'remark 2',
          },
          {
            question: '30',
            answer: 'Yes',
            remark: 'remark 1',
          },
          {
            question: '31',
            answer: 'No',
            remark: 'remark 2',
          },
        ],
        'Back End': [
          {
            question: '24',
            answer: 'Yes',
            remark: 'remark 5',
          },
          {
            question: '25',
            answer: 'Yes',
            remark: 'remark 6',
          },
          {
            question: '34',
            answer: 'Yes',
            remark: 'remark 5',
          },
          {
            question: '35',
            answer: 'Yes',
            remark: 'remark 6',
          },
        ],
      },
      scoreDetails: {
        'Front Desk': '80%',
        'Waiting Area': '70%',
        'Back End': '80%',
      },
      type: 'pdf',
      Name: 'Report 1',
      auditDate: '2023-01-01',
    },
    mobileReport1: {
      summaryList: {
        'Process Adherence': [
          {
            question: '7',
            answer: 'Yes',
            remark: 'remark 7',
          },
        ],
        'Repair Area': [
          {
            question: '4',
            answer: 'No',
            remark: 'remark 4',
          },
        ],
        'Waiting Area': [
          {
            question: '1',
            answer: 'Yes',
            remark: 'remark 1',
          },
          {
            question: '2',
            answer: 'Yes',
            remark: 'remark 2',
          },
        ],
        'Reapir Area': [
          {
            question: '3',
            answer: 'Yes',
            remark: 'remark 3',
          },
        ],
        'Spares Management': [
          {
            question: '5',
            answer: 'Yes',
            remark: 'remark 5',
          },
          {
            question: '6',
            answer: 'Yes',
            remark: 'remark 6',
          },
        ],
      },
      scoreDetails: {
        'Process Adherence': '70%',
        'Repair Area': '60%',
        'Waiting Area': '80%',
        'Reapir Area': '80%',
        'Spares Management': '90%',
      },
      vendorId: null,
      type: 'pdf',
      Name: 'Report 1',
      auditDate: '2023-01-01',
    },
  };

  ngOnInit(): void {
    this.getZip();
  }

  getZip() {
    this.createZip(this.report);
  }

  createZip(files: any) {
    const zip = new JSZip() || undefined;
    let date = new Date();
    const name = 'Audits_' + date.toLocaleDateString() + '.zip';
    const reports = Object.keys(files);
    reports.forEach((value, i) => {
      this.pdfLinePosition = 30;
      console.log(files[value]['auditDate']);
      zip.file(`${value}` + '.pdf', this.returnPdf(files[value]).output());
    });
    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, name);
      }
    });
  }

  returnPdf(object: any) {
    var doc = new jsPDF('portrait', 'pt', 'letter');
    doc.setFontSize(12);
    // doc.lineHeightProportion = 2;
    doc.text(`Report Name : ${object.Name}`, 50, this.pdfLinePosition + 10);
    doc.text(
      `Report Date : ${object.auditDate}`,
      50,
      this.pdfLinePosition + 25
    );
    // var width = doc.getTextWidth('Text');
    // var dim = doc.getTextDimensions('Text');
    const reports = Object.keys(object['summaryList']);
    reports.forEach((table: any, index: number) => {
      doc.text(`Form Name : ${table}`, 50, this.pdfLinePosition + 45);
      var col: any = [];
      col.push(...Object.keys(object['summaryList'][table][0]));
      var rows: any = [];
      object['summaryList'][table].forEach((element: any) => {
        var temp: any = [];
        temp.push(Object.values(element));
        rows.push(...temp);
      });
      this.removeDuplicates(col);
      autoTable(doc, {
        head: [col],
        body: rows,
        startY: this.pdfLinePosition + 50,
        didDrawPage: (d: any) => {
          this.pdfLinePosition = d.cursor.y;
        },
      });
    });
    // Report Summary
    doc.text(`Report Summary`, 50, this.pdfLinePosition + 45);
    var col1 = ['Form Name', 'Score'];
    var rows1: any = [];
    Object.entries(object['scoreDetails']).forEach((entry) => {
      const [key, value] = entry;
      var temp: any = [];
      temp.push(key);
      temp.push(value);
      rows1.push(temp);
    });
    autoTable(doc, {
      head: [col1],
      body: rows1,
      startY: this.pdfLinePosition + 50,
      didDrawPage: (d: any) => {
        this.pdfLinePosition = d.cursor.y;
      },
    });

    doc.setFont('helvetica');
    doc.setFontSize(9);
    // doc.save(object.name)    //To save PDF
    return doc;
  }

  removeDuplicates(array: any) {
    return [...new Set(array)];
  }

  // pdf from html
  downloadPdf() {
    const doc = new jsPDF('p', 'pt', 'a4');
    const source: any = document.getElementById('htmlData');
    // doc.text("Test", 40, 20);
    doc.setFontSize(12);
    doc.html(source, {
      callback: function (pdf: any) {
        doc.text('Hello world1', 10, 10);
        doc.text('Hello world2', 15, 19);
        doc.save('2');
      },
    });
  }
}
