import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-case2',
  templateUrl: './case2.component.html',
  styleUrls: ['./case2.component.css'],
})
export class case2Component implements OnInit {
  report: any = [
    {
      'D-ESC-BVN001': {
        type: 'Moto Audit',
        auditDate: '2023-01-05',
        scoreDetails: {
          'Process Adherence': '70%',
          'Waiting Area': '70%',
          'Repair Area': '60%',
          'Reapir Area': '80%',
          'Spares Management': '90%',
        },
        summaryList: [
          {
            question: '1',
            answer: 'Yes',
            remark: 'remark 1',
            formName: 'Waiting Area',
          },
          {
            question: '2',
            answer: 'Yes',
            remark: 'remark 2',
            formName: 'Waiting Area',
          },
          {
            question: '3',
            answer: 'Yes',
            remark: 'remark 3',
            formName: 'Reapir Area',
          },
          {
            question: '4',
            answer: 'No',
            remark: 'remark 4',
            formName: 'Repair Area',
          },
          {
            question: '5',
            answer: 'Yes',
            remark: 'remark 5',
            formName: 'Spares Management',
          },
          {
            question: '6',
            answer: 'Yes',
            remark: 'remark 6',
            formName: 'Spares Management',
          },
          {
            question: '7',
            answer: 'Yes',
            remark: 'remark 7',
            formName: 'Process Adherence',
          },
        ],
      },
    },
    {
      CSP29: {
        type: 'CCI Audit',
        auditDate: '2023-01-05',
        scoreDetails: {
          'Waiting Area': '60%',
          'Front Desk': '90%',
          'Back End': '70%',
        },
        summaryList: [
          {
            question: '30',
            answer: 'Yes',
            remark: 'remark 1',
            formName: 'Waiting Area',
          },
          {
            question: '31',
            answer: 'No',
            remark: 'remark 2',
            formName: 'Waiting Area',
          },
          {
            question: '32',
            answer: 'Yes',
            remark: 'remark 3',
            formName: 'Front Desk',
          },
          {
            question: '33',
            answer: 'Yes',
            remark: 'remark 4',
            formName: 'Front Desk',
          },
          {
            question: '34',
            answer: 'Yes',
            remark: 'remark 5',
            formName: 'Back End',
          },
          {
            question: '35',
            answer: 'Yes',
            remark: 'remark 6',
            formName: 'Back End',
          },
        ],
      },
      CSP1111: {
        type: 'CCI Audit',
        auditDate: '2023-01-05',
        scoreDetails: {
          'Waiting Area': '60%',
          'Front Desk': '90%',
          'Back End': '70%',
        },
        summaryList: [
          {
            question: '20',
            answer: 'Yes',
            remark: 'remark 1',
            formName: 'Waiting Area',
          },
          {
            question: '21',
            answer: 'No',
            remark: 'remark 2',
            formName: 'Waiting Area',
          },
          {
            question: '22',
            answer: 'Yes',
            remark: 'remark 3',
            formName: 'Front Desk',
          },
          {
            question: '23',
            answer: 'Yes',
            remark: 'remark 4',
            formName: 'Front Desk',
          },
          {
            question: '24',
            answer: 'Yes',
            remark: 'remark 5',
            formName: 'Back End',
          },
          {
            question: '25',
            answer: 'Yes',
            remark: 'remark 6',
            formName: 'Back End',
          },
        ],
      },
    },
  ];

  ngOnInit(): void {
    this.getZip();
  }

  getZip() {
    this.createZip(this.report);
  }

  createZip(data: any) {
    const zip = new JSZip() || undefined;
    let date = new Date();
    const name = 'Audits_' + date.toLocaleDateString() + '.zip';
    data.forEach((item: any) => {
      const reports = Object.keys(item);
      reports.forEach((value, i) => {
        this.pdfLinePosition = 30;
        zip.file(
          `${item[value].type}_${value}_${item[value].auditDate}` + '.pdf',
          this.returnPdf(item[value]).output()
        );
      });
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
    doc.text(
      `Report Date : ${object.auditDate}`,
      50,
      this.pdfLinePosition + 10
    );
    doc.text(`Report Type : ${object.type}`, 50, this.pdfLinePosition + 25);

    // var width = doc.getTextWidth('Text');
    // var dim = doc.getTextDimensions('Text');
    var forms = [...new Set(object['summaryList'].map((i: any) => i.formName))];
    var reportList: any = [];
    forms.forEach((item) => {
      let obj = {
        formName: item,
        summaryDetails: object['summaryList'].filter(
          (a: any) => a.formName == item
        ),
      };
      obj.summaryDetails.forEach((item: any) => delete item.formName);
      reportList.push(obj);
    });
    reportList.forEach((table: any) => {
      doc.text(`Form Name : ${table.formName}`, 50, this.pdfLinePosition + 45);
      var col: any = [];
      col.push(...Object.keys(table.summaryDetails[0]));
      var rows: any = [];
      table['summaryDetails'].forEach((element: any) => {
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
