/***
 * Creates the template for the Asssessment report.
 * @param {List} data -> List of objects that contains all of the data for the report
 * @returns {Object} -> Returns DOCX object.
 */
var docx = require("docx");
var fs = require('fs');

function createReport(data) {    
    console.log(data);
    
    const doc = new docx.Document({
      creator: "Inter American Assessment Team",
      description: "This is a Test",
      title: "Test Document"
    });
  
    const inter_logo = docx.Media.addImage(doc, fs.readFileSync("./public/images/logo_inter.jpg"), 75, 75, {
      floating: {
        horizontalPosition: {
          relative: docx.HorizontalPositionRelativeFrom.LEFT_MARGIN,
          offset: 914400
        },
        verticalPosition: {
          relative: docx.VerticalPositionRelativeFrom.TOP_MARGIN,
          offset: 450000
        }
      }
    });
  
    // ======== Header is here ===========
    const header = new docx.Header({ // The first header
      children: [
        new docx.Paragraph({
          children: [inter_logo]
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Inter American University of Puerto Rico",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Bayamon Campus",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "{ ==== Aqui va el departmento ==== }", // <=== Department goes here
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            after: 500,
          },
        })
      ],
    });
  
    // ======== Header Ends here ===========
  
    // ======== Table Starts Here ========
    let colNum = data.colNums;           // Amount of column in table
    let rowData = data.row;
    let colPercent = data.colPerc;
    let listOfCell = [];     
    let listOfRow = [];
    let headerCells = [];
    let footerCells = [];
  
    const studentCell = new docx.TableCell({
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Students",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            after: 500,
          },
        })],
      width: {
        size : 320,
        type: "AUTO",
      },
      verticalAlign: docx.VerticalAlign.CENTER,
    });
  
    headerCells.push(studentCell);
  
    for(let i = 0; i < colNum; i++) {
      let inputCell = new docx.TableCell({
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: "Criteria " + i+1,
                bold: true
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: {
              after: 500,
            },
          })],
        verticalAlign: docx.VerticalAlign.CENTER,
      });
      headerCells.push(inputCell);
    }
  
    let averageCell = new docx.TableCell({
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Average",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            after: 500,
          },
        })],
      verticalAlign: docx.VerticalAlign.CENTER,
    });
  
    headerCells.push(averageCell);
  
    let headerRow = new docx.TableRow({
      children: headerCells
    });
  
    listOfRow.push(headerRow);
  
    for(let j = 0; j < rowData.length; j++) {      // This loops the amount of rows
      let indexCol = new docx.TableCell({
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: rowData[j].rowID,
                bold: true
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: {
              after: 500,
            },
          })],
        verticalAlign: docx.VerticalAlign.CENTER,
      });
      listOfCell.push(indexCol);
  
      for (let index = 0; index < colNum; index++) {      // This loops the amount of columns
        let tableCol = new docx.TableCell({
          children: [
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: rowData[j].rowIn[index],
                  bold: false
                }),
              ],
              alignment: docx.AlignmentType.CENTER,
              spacing: {
                after: 500,
              },
            })],
          verticalAlign: docx.VerticalAlign.CENTER,
        });
      listOfCell.push(tableCol);
      }
      let avgCol = new docx.TableCell({
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: rowData[j].rowAvg,
                bold: false
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: {
              after: 500,
            },
          })],
        verticalAlign: docx.VerticalAlign.CENTER,
      });
      listOfCell.push(avgCol);
      let row = new docx.TableRow({
        children: listOfCell
      });
      listOfCell = [];
      listOfRow.push(row);
    }
  
    let percDescCell = new docx.TableCell({
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "% of srud. with 3 or more",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            after: 500,
          },
        })],
      verticalAlign: docx.VerticalAlign.CENTER,
    });
  
    footerCells.push(percDescCell);
  
    for(let i = 0; i < colPercent.length; i++) {
      let percCell = new docx.TableCell({
            children: [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: colPercent[i],
                    bold: true
                  }),
                ],
                alignment: docx.AlignmentType.CENTER,
                spacing: {
                  after: 500,
                },
              })],
            verticalAlign: docx.VerticalAlign.CENTER,
          });
      footerCells.push(percCell);    
    }
    let footerRow = new docx.TableRow({
      children: footerCells
    });
    
    listOfRow.push(footerRow);
  
    const table = new docx.Table({
      rows: listOfRow
    });
    // ======== ^^ Table Ends Here ^^ ========
  
    doc.addSection({
      headers: {
        default: header
      },
      children: [
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Faculty Course Assessment Report",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "{ ===== Here goes the course name ===== }",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "{ ==== Here goes the section and credit per hours ==== }",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "{ ==== Here goes term  ==== }",
              bold: true
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "{==== Here goes the professor name ====}",
            }),
          ],
          alignment: docx.AlignmentType.RIGHT,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Catalog Description:",
              bold: true,
            })
          ],
          bullet: {
            level: 0
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "{==== Here goes the class description ====}",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Course Development",
              bold: true,
            })
          ],
          bullet: {
            level: 0
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Target:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "75% of the students must get equal or more than C as final grade in this course",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Grade Distribution:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "======= A table goes here =======",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Result of the Course:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "===== The result goes in here ======",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Modifications Made to Course:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "====== Sets of Bullet point goes here ======",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Course Reflection:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "===== Professor's input goes here =====",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Proposed Action for Course Improvement:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "===== Set of bullet points goes here =====",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Course Outcome b Assessment:",
              bold: true,
            })
          ],
          bullet: {
            level: 0
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Outcome B:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "===== Outcomes Description =====",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Target:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "======= Target Information =======",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Outcome Distribution:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "===== The distribution of the outcome results goes here ======",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Results of outcome b:",
              bold: true,
            })
          ],
          bullet: {
            level: 1
          }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "====== Outcome Results ======",
            }),
          ],
          alignment: docx.AlignmentType.CENTER,
        }),
      ]
    });
  
    doc.addSection({
      children : [table],
    });
  
	return doc;
}

module.exports.createReport = createReport;