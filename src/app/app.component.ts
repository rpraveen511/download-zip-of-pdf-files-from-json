import { Component, VERSION, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  reportlist = [
    {
      name: 'firstday',
      type: 'pdf',
      summaryDetailsList: [
        {
          formName: 'form1',
          summaryDetails: [
            { question: 'question1', answer: 'answer1', remark: 'remark1' },
            { question: 'question2', answer: 'answer2', remark: 'remark2' },
          ],
        },
        {
          formName: 'form2',
          summaryDetails: [
            { question: 'question3', answer: 'answer3', remark: 'remark3' },
            { question: 'question4', answer: 'answer4', remark: 'remark4' },
          ],
        },
      ],
    },
    {
      name: 'secondday',
      type: 'pdf',
      summaryDetailsList: [
        {
          formName: 'form1',
          summaryDetails: [
            { question: 'question5', answer: 'answer15', remark: 'remark15' },
            { question: 'question26', answer: 'answer26', remark: 'remark26' },
          ],
        },
        {
          formName: 'form2',
          summaryDetails: [
            { question: 'question17', answer: 'answer17', remark: 'remark17' },
            { question: 'question28', answer: 'answer28', remark: 'remark28' },
          ],
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.getZip();
  }

  getZip() {
    this.createZip(this.reportlist);
  }

  createZip(files: any[]) {
    const zip = new JSZip() || undefined;
    const name = 'Audits_' + '.zip';

    files.forEach((value, i) => {
      zip.file(value.name + '.pdf', this.returnPdf(value).output());
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, name);
      }
    });
  }

  returnPdf(object: any) {
    var doc = new jsPDF('portrait', 'cm', 'letter');
    // doc.lineHeightProportion = 2;
    doc.text(object.name, 1, 1);
    doc.text(object.type, 1, 2);
    object['summaryDetailsList'].forEach((table: any, index: number) => {
      doc.text(table.formName, 1, index + 3);
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
      });
    });
    doc.setFont('helvetica');
    doc.setFontSize(9);
    // doc.save(object.name)
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
