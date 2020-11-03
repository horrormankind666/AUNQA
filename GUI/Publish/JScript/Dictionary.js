/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๖/๐๓/๒๕๖๑>
Modify date : <๐๒/๑๑/๒๕๖๓>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับพจนานุกรม>
=============================================
*/

(function () {
  "use strict";

  angular.module("dictMod", [])
       
  .service("dictServ", function () {
    var self = this;

    self.dict = {
      menuTmp: {},
      systemName: {
        TH: "ระบบการประกันคุณภาพการศึกษาในอาเซียน",
        EN: "ASEAN University Network Quality Assurance ( AUNQA )",
        html: "ASEAN University Network Quality Assurance</br>( AUNQA )",
        HRi: {
				  TH: "ระบบสืบค้นข้อมูลบุคลากร",
					EN: "HRi Search Information System"
        }
      },
      footer: {
				TH: ("<span class='f10'><i class='fa fa-copyright' aria-hidden='true'></i></span> สงวนลิขสิทธิ์ พ.ศ. 2560 " + ((new Date().getFullYear() + 543) > 2560 ? (" - " + (new Date().getFullYear() + 543)) : "") + " มหาวิทยาลัยมหิดล, พัฒนาโดย กองเทคโนโลยีสารสนเทศ"),
				EN: ("Copyright <span class='f10'><i class='fa fa-copyright'></i></span> 2017 " + ((new Date().getFullYear() > 2017) ? (" - " + new Date().getFullYear()) : "") + " Mahidol University. All rights reserved."),
				HRi: {
					TH: ("<span class='f10'><i class='fa fa-copyright' aria-hidden='true'></i></span> สงวนลิขสิทธิ์ พ.ศ. 2562 " + ((new Date().getFullYear() + 543) > 2562 ? (" - " + (new Date().getFullYear() + 543)) : "") + " มหาวิทยาลัยมหิดล, พัฒนาโดย กองเทคโนโลยีสารสนเทศ"),
					EN: ("Copyright <span class='f10'><i class='fa fa-copyright'></i></span> 2019 " + ((new Date().getFullYear() > 2019) ? (" - " + new Date().getFullYear()) : "") + " Mahidol University. All rights reserved.")
				}
      },
      processingSuccessful: {
        TH: "ประมวลผลสำเร็จ",
        EN: "Processing successful."
      },
      processingNotSuccessful: {
        TH: "ประมวลผลไม่สำเร็จ กรุณารีเฟรชหน้าจอ หรือเปลี่ยนเว็บเบราว์เซอร์",
        EN: "Processing was not successful, Please refresh this page or change web browser."
      },
      modeUndefined: {
        TH: "ไม่พบโหมดการทำงาน",
        EN: "Mode undefined"
      },
      msgPreloading: {
        loading: {
          TH: "กำลังโหลด",
          EN: "Loading..."
        },
        saving: {
          TH: "กำลังบันทึก",
          EN: "Saving..."
        },
        removing: {
          TH: "กำลังลบ",
          EN: "Removing..."
        },
        loadMore: {
          TH: "มีต่อ...",
          EN: "Load more..."
        },
        searching: {
          TH: "กำลังค้นหา",
          EN: "Searching..."
        }
      },
			survey: {
				TH: "ขอรบกวนผู้ใช้งานทุกท่านตอบ <a class='link' href='https://docs.google.com/forms/d/e/1FAIpQLSdIfvO7b-9vW9yVWkuUIx7IiYUhlzEyTmEBdMq-_kkoAP_qNQ/viewform?usp=pp_url&entry.1320515055=AUNQA' target='_blank'>แบบประเมินความพึ่งพอใจในการใช้งาน</a> เพื่อไปปรับปรุงระบบให้ดียิ่ง<div class='text-right marginTop15'>ขอขอบคุณผู้ใช้งานทุกท่าน<br />ผู้พัฒนาระบบ</div>",
				EN: "ขอรบกวนผู้ใช้งานทุกท่านตอบ <a class='link' href='https://docs.google.com/forms/d/e/1FAIpQLSdIfvO7b-9vW9yVWkuUIx7IiYUhlzEyTmEBdMq-_kkoAP_qNQ/viewform?usp=pp_url&entry.1320515055=AUNQA' target='_blank'>แบบประเมินความพึ่งพอใจในการใช้งาน</a> เพื่อไปปรับปรุงระบบให้ดียิ่ง<div class='text-right marginTop15'>ขอขอบคุณผู้ใช้งานทุกท่าน<br />ผู้พัฒนาระบบ</div>"
			},
      credit: {
        TH: "เครดิต",
        EN: "Credit"
      },
      MUQD: {
        TH: "กองพัฒนาคุณภาพ สำนักงานอธิการบดี มหาวิทยาลัยมหิดล",
        EN: "Mahidol University Quality Development"
      },
      dropdown: {
        TH: "เมนูย่อย",
        EN: "Drop Down Menu"
      },
      create: {
        TH: "สร้าง",
        EN: "Create"
      },
      search: {
        TH: "ค้นหา",
        EN: "Search"
      },
      add: {
        TH: "เพิ่ม",
        EN: "Add",
        confirm: {
          TH: "ต้องการบันทึกข้อมูลนี้หรือไม่",
          EN: "Do you want to save changes ?"
        }
      },
      edit: {
        TH: "แก้ไข",
        EN: "Edit",
        confirm: {
          TH: "ต้องการบันทึกข้อมูลนี้หรือไม่",
          EN: "Do you want to save changes ?"
        }
      },
      update: {
        TH: "ปรับปรุง",
        EN: "Update",
        confirm: {
          TH: "ต้องการบันทึกข้อมูลนี้หรือไม่",
          EN: "Do you want to save changes ?"
        }
      },
      remove: {
        TH: "ลบ",
        EN: "Remove",
        confirm: {
          TH: "ต้องการลบข้อมูลนี้หรือไม่",
          EN: "Do you want to remove ?"
        }
      },
      back: {
        TH: "ย้อนกลับ",
        EN: "Go Back"
      },
      filter: {
        TH: "ตัวกรอง",
        EN: "Filter"
      },
      reload: {
        TH: "รีโหลด",
        EN: "Reload"
      },
      selectAll: {
        TH: "เลือกทั้งหมด",
        EN: "Select All"
      },
      order: {
        TH: "ลำดับ",
        EN: "Order"
      },
      found: {
        TH: "พบ",
        EN: "Found"
      },
      entries: {
        TH: "รายการ",
        EN: "Entries",
        selectError: {
          TH: "กรุณาเลือกรายการที่ต้องการ",
          EN: "Please select item."
        }
      },
      from: {
        TH: "จาก",
        EN: "From"
      },
      englishOnly: {
        TH: "ภาษาอังกฤษเท่านั้น",
        EN: "English Only"
      },
      alphabetnumericOnly: {
        TH: "ตัวอักษรและตัวเลขเท่านั้น",
        EN: "Alphabet and Numeric Only"
      },
      englishnumericOnly: {
        TH: "ภาษาอังกฤษและตัวเลขเท่านั้น",
        EN: "English and Numeric Only"
      },
      thainumericOnly: {
        TH: "ภาษาไทยและตัวเลขเท่านั้น",
        EN: "Thai and Numeric Only"
      },
      numericOnly: {
        TH: "ตัวเลขเท่านั้น",
        EN: "Numeric Only"
      },
      dateFormat: {
        TH: "วัน/เดือน/ปี ( ค.ศ. )",
        EN: "Day/Month/Year ( A.D. )"
      },
      placeholder: {
        branch: {
          TH: "เลือกสาขา",
          EN: "Please select Branch"
        },
        departmentType: {
          TH: "เลือกประเภท",
          EN: "Please select Department Type"
        },
        mode: {
          TH: "เลือกประเภท",
          EN: "Please select Mode"
        },
        status: {
          TH: "เลือกสถานะ",
          EN: "Please select Status"
        },
        isced: {
          TH: "เลือกกลุ่มสาขาวิชา ISCED",
          EN: "Please select ISCED"
        },
        iscedGrouped: {
          TH: "เลือกกลุ่ม ISCED",
          EN: "Please select ISCED Grouped"
        },
        course: {
          TH: "เลือกรายวิชา",
          EN: "Please select Course"
        },
        country: {
          TH: "เลือกประเทศ",
          EN: "Please select Country"
        },
        career: {
          TH: "เลือกอาชีพ",
          EN: "Please select Career"
        },
        instructorType: {
          TH: "เลือกประเภทอาจารย์",
          EN: "Please select Instructor Type"
        },
        faculty: {
          TH: "เลือกคณะ / ส่วนงาน",
          EN: "Please select Faculty"
        },
        department: {
          TH: "เลือกส่วนงาน",
          EN: "Please select Department"
        },
        subject: {
          TH: "เลือกหมวดวิชา",
          EN: "Please select Subject"
        },
        plos: {
          TH: "เลือกผลลัพธ์การเรียนรู้ระดับหลักสูตร",
          EN: "Please select Program Learning Outcomes ( PLOs )"
        },
        indicator: {
          TH: "เลือกตัวบ่งชี้",
          EN: "Please select Indicator"
        },
        year: {
          TH: "เลือกปี",
          EN: "Please select Year"
        },
        semester: {
          TH: "เลือกภาคการศึกษา",
          EN: "Please select Semester"
        },
        position: {
          TH: "เลือกตำแหน่ง",
          EN: "Please select Position"
        }
      },
      save: {
        TH: "บันทึก",
        EN: "Save",
        error: {
          TH: "กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน",
          EN: "Please fill in the information correctly and completely.",
          unique: {
            TH: "รายการนี้มีอยู่แล้ว",
            EN: "Duplicate."
          },
          verifyRemark: {
            TH: "กรุณาระบุเหตุผลที่ไม่อนุมัตื",
            EN: "Please enter reason for reject."
          }
        }
      },
      discard: {
        TH: "เลิกทำ",
        EN: "Discard"
      },
      cancel: {
        TH: "ยกเลิก",
        EN: "Cancel"
      },
      ok: {
        TH: "ตกลง",
        EN: "OK"
      },
      close: {
        TH: "ปิด",
        EN: "Close"
      },
      confirm: {
        TH: "ยืนยัน",
        EN: "Confirm"
      },
      to: {
        TH: "ถึง",
        EN: "To"
      },
      click: {
        TH: "คลิก",
        EN: "Click"
      },
      detail: {
        TH: "รายละเอียด",
        EN: "Detail"
      },
      manage: {
        TH: "บริหารจัดการ",
        EN: "Manage"
      },
      saveSuccess: {
        TH: "บันทึกข้อมูลสำเร็จ",
        EN: "Successfully saved."
      },
      saveNotSuccess: {
        TH: "บันทึกข้อมูลไม่สำเร็จ",
        EN: "Not successfully saved."
      },
      deleteSuccess: {
        TH: "ลบข้อมูลสำเร็จ",
        EN: "Successfully deleted."
      },
      deleteNotSuccess: {
        TH: "ลบข้อมูลไม่สำเร็จ",
        EN: "Not successfully deleted."
      },
      verify: {
        TH: "อนุมัติ",
        EN: "Verify",
        verified: {
          TH: "อนุมัติแล้ว",
          EN: "Verified"
        },
        pendingVerify: {
          TH: "รออนุมัติ",
          EN: "Pending Verify"
        },
        sendingVerify: {
          TH: "รอส่งอนุมัติ",
          EN: "Sending Verify"
        }
      },
      reject: {
        TH: "ไม่อนุมัติ",
        EN: "Reject"
      },
      sendVerify: {
        TH: "ส่งอนุมัติ",
        EN: "Send"
      },
      reason: {
        TH: "เหตุผล (..........)",
        EN: "Reason (..........)"
      },
      pleaseSpecify: {
        TH: "กรุณาระบุ",
        EN: "Please Specify "
      },
      verifyStatus: [
        {
          id: "S",
          name: {
            TH: "รอส่งอนุมัติ",
            EN: "Sending Verify"
          }
        },
        {
          id: "P",
          name: {
            TH: "รออนุมัติ",
            EN: "Pending Verify"
          }
        },
        {
          id: "Y",
          name: {
            TH: "อนุมัติ",
            EN: "Verified"
          }
        },
        {
          id: "N",
          name: {
            TH: "ไม่อนุมัติ",
            EN: "Reject"
          }
        }
      ],
      meaningVerifyStatus: {
        S: {
          TH: "รอส่งอนุมัติ",
          EN: "Sending Verify"
        },
        P: {
          TH: "รออนุมัติ",
          EN: "Pending Verify"
        },
        Y: {
          TH: "อนุมัติ",
          EN: "Verified"
        },
        N: {
          TH: "ไม่อนุมัติ",
          EN: "Reject"
        }
      },
      mode: [
        {
          id: "add",
          name: {
            TH: "เพิ่ม",
            EN: "Add"
          }
        },
        {
          id: "edit",
          name: {
            TH: "แก้ไข",
            EN: "Edit"
          }
        },
        {
          id: "update",
          name: {
            TH: "ปรับปรุง",
            EN: "Update"
          }
        }
      ],
      instructorType: [
        {
          id: "I",
          name: {
            TH: "อาจารย์ภายนอก",
            EN: "Lecturer"
          }
        },
        {
          id: "P",
          name: {
            TH: "อาจารย์ประจำ",
            EN: "Instructor"
          }
        },
        {
          id: "N/A",
          name: {
            TH: "ไม่ระบุ",
            EN: "N/A"
          }
        }
      ],
      without: [
        {
          id: "Y",
          name: {
            TH: "มี",
            EN: "With"
          }
        },
        {
          id: "N",
          name: {
            TH: "ไม่มี",
            EN: "Without"
          }
        }
      ],
      transactionHistory: {
        TH: "ประวัติการทำรายการ",
        EN: "Transaction History"
      },
      dataPresent: {
        TH: "ข้อมูลปัจจุบัน",
        EN: "Data Present"
      },
      keyword: {
        TH: "คำค้น",
        EN: "Keyword"
      },
      who: {
        TH: "ใคร",
        EN: "Who"
      },
      by: {
        TH: "โดย",
        EN: "By"
      },
      createdBy: {
        TH: "สร้างโดย",
        EN: "Create By"
      },
      createdDate: {
        TH: "สร้างเมื่อ",
        EN: "Create Date"
      },
      sendVerifyBy: {
        TH: "ส่งอนุมัติโดย",
        EN: "Send Verify By"
      },
      sendVerifyDate: {
        TH: "ส่งอนุมัติเมื่อ",
        EN: "Send Verify Date"
      },
      verifyBy: {
        TH: "อนุมัติโดย",
        EN: "Verify By"
      },
      verifyDate: {
        TH: "อนุมัติเมื่อ",
        EN: "Verify Date"
      },
      code: {
        TH: "รหัส",
        EN: "Code"
      },
      thai: {
        TH: "ภาษาไทย",
        EN: "Thai"
      },
      english: {
        TH: "ภาษาอังกฤษ",
        EN: "English"
      },
      name: {
        TH: "ชื่อ",
        EN: "Name",
        thai: {
          TH: "ชื่อภาษาไทย",
          EN: "Name Thai"
        },
        english: {
          TH: "ชื่อภาษาอังกฤษ",
          EN: "Name English"
        }
      },
      fullName: {
        TH: "ชื่อเต็ม",
        EN: "Full Name"
      },
      initials: {
        TH: "ชื่อย่อ",
        EN: "Initials"
      },
      abbreviation: {
        TH: "อักษรย่อ",
        EN: "Abbreviation"
      },
      unit: {
        TH: "หน่วย",
        EN: "Unit",
        credits: {
          TH: "หน่วยกิต",
          EN: "Credits"
        },
        baht: {
          TH: "บาท",
          EN: "Bath"
        },
        persons: {
          TH: "คน",
          EN: "Persons"
        },
        hour: {
          TH: "ชั่วโมง",
          EN: "Hour"
        },
        week: {
          TH: "สัปดาห์",
          EN: "Week"
        },
        students: {
          TH: "คน",
          EN: "Students"
        }
      },
      email: {
        TH: "อีเมล",
        EN: "E-Mail"
      },
      other: {
        TH: "อื่น ๆ",
        EN: "Other"
      },
      yearOfStudy: {
        TH: "ปีการศึกษา",
        EN: "Year of Study"
      },
      academicYear: {
        TH: "ปีการศึกษา",
        EN: "Academic Year"
      },
      year: {
        TH: "ปี",
        EN: "Year"
      },
      trimester: {
        TH: "ภาคการศึกษา",
        EN: "Semester"
      },
      semester: {
        TH: "ภาคการศึกษาที่",
        EN: "Semester",
        sector: [
          {
            id: "1",
            name: {
              TH: "1",
              EN: "1"
            }
          },
          {
            id: "2",
            name: {
              TH: "2",
              EN: "2"
            }
          },
          {
            id: "3",
            name: {
              TH: "3",
              EN: "3"
            }
          },
          {
            id: "summer",
            name: {
              TH: "ฤดูร้อน",
              EN: "Summer"
            }
          },
          {
            id: "12",
            name: {
              TH: "1 และ 2",
              EN: "1 and 2 "
            }
          }
        ]
      },
      amount: {
        TH: "จำนวน",
        EN: "Amount"
      },
      cost: {
        TH: "รายจ่าย",
        EN: "Cost"
      },
      income: {
        TH: "รายได้",
        EN: "Income"
      },
      per: {
        TH: "ต่อ",
        EN: "per"
      },
      courseCredit: {
        TH: "จำนวนหน่วยกิต",
        EN: "Credit",
        lecture: {
          TH: "ทฤษฎี",
          EN: "Lecture"
        },
        laboratory: {
          TH: "ปฏิบัติ",
          EN: "Laboratory"
        },
        selfstudy: {
          TH: "ศึกษาด้วยตนเอง",
          EN: "Self-Study"
        }
      },
      studyTime: {
        TH: "เวลาเรียน",
        EN: "Study Time"
      },
      meaning: {
        TH: "ความหมาย",
        EN: "Meaning"
      },
      total: {
        TH: "รวม",
        EN: "Total"
      },
      notiAppointment: {
        TH: "คำสั่งแต่งตั้ง",
        EN: "Notification on Appointment"
      },
      notiDate: {
        TH: "วันที่คำสั่ง",
        EN: "Notification Date"
      },
      remark: {
        TH: "หมายเหตุ",
        EN: "Remark"
      },
      profile: {
        TH: "ข้อมูลส่วนตัว",
        EN: "Profile"
      },
      namePrefix: {
        TH: "คำนำหน้าชื่อ",
        EN: "Name Prefix"
      },
      authen: {
        username: {
          TH: "ชื่อผู้ใช้งาน",
          EN: "Username"
        },
        password: {
          TH: "รหัสผ่าน",
          EN: "Password"
        },
        signin: {
          TH: "เข้าสู่ระบบ",
          EN: "Sign In"
        },
        reqSignin: {
          TH: "กรุณาเข้าระบบ",
          EN: "Please sign in."
        },
        accessNotFound: {
          TH: "ไม่พบการเข้าใช้งาน",
          EN: "Access not found."
        },
        userNotFound: {
          TH: "ไม่พบผู้ใช้งาน",
          EN: "User not found."
        },
        accessInvalid: {
          TH: "ข้อมูลการเข้าใช้งานไม่ถูกต้อง",
          EN: "Access invalid."
        },
        usernamePasswordInvalid: {
          TH: "ข้อมูลผู้ใช้งานและรหัสผ่านไม่ถูกต้อง",
          EN: "Username and Password invalid."
        },
        tokenExpires: {
          TH: "Token หมดอายุ",
          EN: "Token expires or not refresh!"
        },
        tokenFail: {
          TH: "ข้อมูล Token ไม่ถูกต้อง",
          EN: "Parse data token fail!"
        },
        permissionInvalid: {
          TH: "สิทธิ์เข้าใช่้งานไม่ตรงกับฐานข้อมูล",
          EN: "Permission invalid."
        },
        permissionNotFound: {
          TH: "ไม่พบสิทธิ์เข้าใช่้งาน",
          EN: "Permission not found."
        }
      },
      academicInfo: {
        TH: "ข้อมูลการศึกษา",
        EN: "Academic Info"
      },
      anyLang: {
        TH: "เลือกบันทึกภาษาใดก็ได้",
        EN: "Choose to Record Any Language"
      },
      faculty: {
        TH: "ข้อมูลคณะ",
        EN: "Faculty",
        facultyNotFound: {
          TH: "ไม่พบข้อมูลคณะ",
          EN: "Faculty not found."
        },
        table: {
          code: {
            TH: "รหัสคณะ",
            EN: "Faculty Code"
          },
          name: {
            TH: "ชื่อคณะ",
            EN: "Faculty Name"
          },
          concise: {
            TH: "ชื่อย่อ ( บัตรนักศึกษา )",
            EN: "Initials ( Student Card )"
          },
          branch: {
            TH: "สาขา",
            EN: "Branch"
          }
        },
        save: {
          error: {
            code: {
              TH: "กรุณาระบุรหัส",
              EN: "Please enter code."
            },
            name: {
              TH: {
                TH: "กรุณาระบุชื่อเต็ม ( ภาษาไทย )",
                EN: "Please enter full name ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุชื่อเต็ม ( ภาษาอังกฤษ )",
                EN: "Please enter full name ( English Language )."
              }
          },
          concise: {
              TH: {
                TH: "กรุณาระบุชื่อย่อ ( บัตรนักศึกษา ) ( ภาษาไทย )",
                EN: "Please enter initials ( student card ) ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุชื่อย่อ ( บัตรนักศึกษา ) ( ภาษาอังกฤษ )",
                EN: "Please enter initials ( student card ) ( English Language )."
              }
            }
          }
        }
      },
      department: {
        TH: "ข้อมูลภาควิชา",
        EN: "Department",
        table: {
          code: {
            TH: "รหัสภาควิชา",
            EN: "Department Code"
          },
          name: {
            TH: "ชื่อภาควิชา",
            EN: "Department Name"
          },
          date: {
            TH: "วันที่",
            EN: "Date"
          },
          departmentType: {
            TH: "ประเภท",
            EN: "Department Type"
          },
          verifyStatus: {
            TH: "สถานะ",
            EN: "Status"
          }
        },
        verify: {
          TH: "ข้อมูลภาควิชา : อนุมัติ",
          EN: "Department : Verify"
        },
        reject: {
          TH: "ข้อมูลภาควิชา : ไม่อนุมัติ",
          EN: "Department : Reject"
        },
        save: {
          error: {
            code: {
              TH: "กรุณาระบุรหัส",
              EN: "Please enter code."
            },
            name: {
              TH: {
                TH: "กรุณาระบุชื่อเต็ม ( ภาษาไทย )",
                EN: "Please enter full name ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุชื่อเต็ม ( ภาษาอังกฤษ )",
                EN: "Please enter full name ( English Language )."
              }
            }
          }
        }
      },
      major: {
        TH: "ข้อมูลสาขาวิชา",
        EN: "Major",
        table: {
          code: {
            TH: "รหัสสาขาวิชา",
            EN: "Major Code"
          },
          name: {
            TH: "ชื่อสาขาวิชา",
            EN: "Major Name"
          },
          verifyStatus: {
            TH: "สถานะ",
            EN: "Status"
          }
        },
        verify: {
          TH: "ข้อมูลสาขาวิชา : อนุมัติ",
          EN: "Major : Verify"
        },
        reject: {
          TH: "ข้อมูลสาขาวิชา : ไม่อนุมัติ",
          EN: "Major : Reject"
        },
        save: {
          error: {
            code: {
              TH: "กรุณาระบุรหัส",
              EN: "Please enter code."
            },
            name: {
              TH: {
                TH: "กรุณาระบุชื่อเต็ม ( ภาษาไทย )",
                EN: "Please enter full name ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุชื่อเต็ม ( ภาษาอังกฤษ )",
                EN: "Please enter full name ( English Language )."
              }
            }
          }
        }
      },
      literacy: {
        TH: "Literacy",
        EN: "Literacy",
        grouped: [
          {
            id: "main",
            name: {
              TH: "กลุ่มหลัก",
              EN: "Main Group"
            }
          },
          {
            id: "secondary",
            name: {
              TH: "กลุ่มรอง",
              EN: "Secondary Group"
            }
          }
        ]
      },
      counselingStudents: {
        TH: "การให้คำปรึกษาและแนะนำทางวิชาการแก่นักศึกษาเป็นรายบุคคล",
        EN: "Counseling and Academic Guidance for Individual Students",
        table: {
          processMethod: {
            TH: "กระบวนการหรือวิธีการ",
            EN: "Process or Method"
          },
          timeAllocated: {
            TH: "เวลาที่จัดสรร",
            EN: "Time Allocated"
          }
        },
        save: {
          error: {
            processMethod: {
              TH: "กรุณาระบุกระบวนการหรือวิธีการ",
              EN: "Please enter process or method."
            },
            timeAllocated: {
              TH: "กรุณาระบุเวลาที่จัดสรร",
              EN: "Please enter time allocated."
            },
            unit: {
              TH: "กรุณาระบุหน่วย",
              EN: "Please enter unit."
            }
          }
        }
      },

      course: {
        TH: "ข้อมูลรายวิชา",
        EN: "Course",
        courseNotFound: {
          TH: "ไม่พบข้อมูลรายวิชา",
          EN: "Course not found."
        },
        table: {
          code: {
            TH: "รหัสรายวิชา",
            EN: "Course Code"
          },
          name: {
            TH: "ชื่อรายวิชา",
            EN: "Course Name"
          },
          curriculum: {
            TH: "หลักสูตร",
            EN: "Curriculum"
          },
          document: {
            TH: "จัดเอกสารเป็น",
            EN: "Document"
          },
          typeOfSubject: {
            TH: "ประเภทของรายวิชา",
            EN: "Type of Subject"
          },
          numberOfStudents: {
            TH: "จำนวนผู้เรียนที่รับได้",
            EN: "Number of Students"
          },
          courseCreationDate: {
            TH: "วันที่จัดทำรายวิชา",
            EN: "Course Creation Date"
          },
          courseLastUpdated: {
            TH: "วันที่ปรับปรุงรายละเอียดของรายวิชาครั้งล่าสุด",
            EN: "Course Last Updated"
          },
          goals: {
            TH: "จุดมุ่งหมายของรายวิชา",
            EN: "Goals"
          },
          objectives: {
            TH: "วัตถุประสงค์ในการพัฒนา / ปรับปรุงรายวิชา",
            EN: "Objectives of Development / Revision"
          },
          courseDescriptions: {
            TH: "คำอธิบายรายวิชา",
            EN: "Course Descriptions"
          },
          hoursPerSemester: {
            TH: "จำนวนชั่วโมงที่ใช้ต่อภาคการศึกษา",
            EN: "Number of Hours per Semester"
          },
          verifyStatus: {
            TH: "สถานะ",
            EN: "Status"
          }
        },
        verify: {
          TH: "ข้อมูลรายวิชา : อนุมัติ",
          EN: "Course : Verify"
        },
        reject: {
          TH: "ข้อมูลรายวิชา : ไม่อนุมัติ",
          EN: "Course : Reject"
        },
        save: {
          error: {
            code: {
              EN: {
                TH: "กรุณาระบุรหัส ( ภาษาอังกฤษ )",
                EN: "Please enter code ( English Language )."
              }
            },
            name: {
              EN: {
                TH: "กรุณาระบุชื่อเต็ม ( ภาษาอังกฤษ )",
                EN: "Please enter full name ( English Language )."
              }
            },
            courseCredit: {
              TH: "กรุณาระบุจำนวนหน่วยกิต",
              EN: "Please enter course credit."
            },
            course: {
              TH: "กรุณาเลือกรายวิชา",
              EN: "Please select course."
            }
          }
        }
      },
      isced: {
        TH: "กลุ่มสาขาวิชา ISCED",
        EN: "ISCED",
        mean: {
          TH: "มาตรฐานการจัดจำแนกการศึกษา : สาขาวิชา",
          EN: "International Standard Classification of Education"
        },
        grouped: [
          {
            id: "main",
            name: {
              TH: "กลุ่มหลัก",
              EN: "Main Group"
            },
            tab: {
              TH: "กลุ่มหลัก",
              EN: "Main Group"
            }
          },
          {
            id: "secondary",
            name: {
              TH: "กลุ่มรอง",
              EN: "Secondary Group"
            },
            tab: {
              TH: "กลุ่มรอง ( ถ้ามี )",
              EN: "Secondary Group ( if any )"
            }
          }
        ],
        table: {
          grouped: {
            TH: "จัดอยู่ในกลุ่ม",
            EN: "ISCED Grouped"
          },
          code: {
            TH: "รหัส ISCED",
            EN: "ISCED ID"
          },
          name: {
            TH: "ชื่อ ISCED",
            EN: "ISCED Name"
          }
        },
        save: {
          error: {
            isced: {
              TH: "กรุณาเลือกกลุ่มสาขาวิชา ISCED",
              EN: "Please select ISCED."
            },
            iscedGrouped: {
              TH: "กรุณาเลือกกลุ่ม ISCED",
              EN: "Please select ISCED grouped."
            }
          }
        }
      },
      majorSubject: {
        table: {
          name: {
            TH: "ชื่อวิชาเอก",
            EN: "Major Subject Name"
          }
        }
      },
      institute: {
        TH: "สถาบัน",
        EN: "Institute",
        table: {
          country: {
            TH: "ประเทศ",
            EN: "Country"
          },
          name: {
            TH: "ชื่อสถาบัน",
            EN: "Institute Name"
          }
        },
        save: {
          error: {
            country: {
              TH: "กรุณาเลือกประเทศ",
              EN: "Please select country."
            },
            name: {
              TH: "กรุณาระบุชื่อสถาบัน",
              EN: "Please enter institute name."
            }
          }
        }
      },
      career: {
        table: {
          name: {
            TH: "ชื่ออาชีพ",
            EN: "Career Name"
          }
        },
        save: {
          error: {
            name: {
              TH: "กรุณาระบุชื่ออาชีพ",
              EN: "Please enter career name."
            }
          }
        }
      },
      instructor: {
        TH: "ข้อมูลอาจารย์",
        EN: "Instructor",
        table: {
          position: {
            TH: "ตำแหน่ง",
            EN: "Position"
          },
          coursePosition: {
            TH: "ตำแหน่งในหลักสูตร",
            EN: "Position in the Course"
          },
          fullName: {
            TH: "ชื่อ - นามสกุล",
            EN: "Name - Surname"
          },
          firstOrlastName: {
            TH: "ชื่อ / นามสกุล",
            EN: "First / Last Name"
          },
          degree: {
            TH: "คุณวุฒิ",
            EN: "Degree"
          },
          faculty: {
            TH: "คณะ / ส่วนงานที่สังกัด",
            EN: "Faculty"
          },
          department: {
            TH: "ภาควิชาที่สังกัด",
            EN: "Department"
          },
          major: {
            TH: "สาขาวิชา",
            EN: "Major"
          },
          graduationYear: {
            TH: "ปีที่สำเร็จการศึกษา",
            EN: "Graduation Year"
          },
          instructorType: {
            TH: "ประเภทอาจารย์",
            EN: "Type"
          }
        },
        group: [
          {
            id: "instructorResponsible",
            name: {
              TH: "อาจารย์ผู้รับผิดชอบหลักสูตร",
              EN: "Instructors in charge of curriculum"
            },
            isAdd: false,
            type: "program"
          },
          {
            id: "instructorCourse",
            name: {
              TH: "อาจารย์ประจำหลักสูตร",
              EN: "Full time instructors of the curriculum"
            },
            isAdd: true,
            type: "program"
          },
          {
            id: "instructorRegular",
            name: {
              TH: "อาจารย์ประจำ",
              EN: "Full time instructors"
            },
            isAdd: true,
            type: "program"
          },
          {
            id: "instructorSpectial",
            name: {
              TH: "อาจารย์พิเศษ",
              EN: "Part time instructors"
            },
            isAdd: true,
            type: "program"
          },
          {
            id: "instructorResponsible",
            name: {
              TH: "อาจารย์ผู้รับผิดชอบรายวิชา",
              EN: "Instructors Responsible"
            },
            isAdd: true,
            type: "course"
          },
          {
            id: "instructorLecturer",
            name: {
              TH: "อาจารย์ผู้สอน",
              EN: "Instructors Lecturer"
            },
            isAdd: true,
            type: "course"
          }
        ]
      },
      placeStudy: {
        table: {
          name: {
            TH: "สถานที่เรียน",
            EN: "Place of Study"
          },
          department: {
            TH: "ส่วนงาน",
            EN: "Department"
          },
          building: {
            TH: "อาคาร",
            EN: "Building"
          },
          room: {
            TH: "ห้อง",
            EN: "Room"
          }
        },
        save: {
          error: {
            name: {
              TH: {
                TH: "กรุณาระบุชื่อสถานที่เรียน ( ภาษาไทย )",
                EN: "Please enter place of study name ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุชื่อสถานที่เรียน ( ภาษาอังกฤษ )",
                EN: "Please enter place of study name ( English Language )."
              }
            },
            department: {
              TH: "กรุณาเลือกส่วนงาน",
              EN: "Please select department."
            },
            departmentOtherRemark: {
              TH: "กรุณาระบุส่วนงาน",
              EN: "Please enter department."
            }
          }
        }
      },
      programObjectives: {
        save: {
          error: {
            name: {
              TH: {
                TH: "กรุณาระบุวัตถุประสงค์ ( ภาษาไทย )",
                EN: "Please enter objectives ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุวัตถุประสงค์ ( ภาษาอังกฤษ )",
                EN: "Please enter objectives ( English Language )."
              }
            }
          }
        }
      },
      plos: {
        table: {
          code: {
            TH: "รหัส PLOs",
            EN: "PLOs ID"
          },
          name: {
            TH: "ผลลัพธ์การเรียนรู้ระดับหลักสูตร",
            EN: "Program Learning Outcomes ( PLOs )"
          },
          expectedOutcome: {
            TH: "ผลลัพธ์ที่คาดหวัง",
            EN: "Expected Outcome"
          },
          detail: {
            TH: "รายละเอียด",
            EN: "Detail"
          },
          strategies: {
            teaching: {
              TH: "กลยุทธ์การสอน",
              EN: "Teaching Strategies"
            },
            evaluation: {
              TH: "กลยุทธ์การวัดและประเมินผล",
              EN: "Evaluation Strategies"
            }
          }
        },
        save: {
          error: {
            name: {
              TH: {
                TH: "กรุณาระบุ PLOs ( ภาษาไทย )",
                EN: "Please enter PLOs ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุ PLOs ( ภาษาอังกฤษ )",
                EN: "Please enter english PLOs ( English Language )."
              }
            },
            plos: {
              TH: "กรุณาเลือกผลลัพธ์การเรียนรู้ระดับหลักสูตร",
              EN: "Please select PLOs."
            },
            detail: {
              TH: {
                TH: "กรุณาระบุรายละเอียด ( ภาษาไทย )",
                EN: "Please enter detail ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุรายละเอียด ( ภาษาอังกฤษ )",
                EN: "Please enter detail ( English Language )."
              }
            },
            strategies: {
              teaching: {
                TH: "กรุณาเลือกกลยุทธ์การสอน",
                EN: "Please select teaching strategies."
              },
              evaluation: {
                TH: "กรุณาเลือกกลยุทธ์การวัดและประเมินผล",
                EN: "Please select evaluation strategies."
              }
            }
          }
        }
      },
      subPLOs: {
        TH: "PLOs รายการย่อย",
        EN: "Sub PLOs",
        table: {
          name: {
            TH: "PLOs รายการย่อย",
            EN: "Sub PLOs"
          }
        },
        save: {
          error: {
            name: {
              TH: {
                TH: "กรุณาระบุ PLOs รายการย่อย ( ภาษาไทย )",
                EN: "Please enter Sub PLOs ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุ PLOs รายการย่อย ( ภาษาอังกฤษ )",
                EN: "Please enter Sub PLOs ( English Language )."
              }
            }
          }
        }
      },
      developPlan: {
        table: {
          plan: {
            TH: "แผนการพัฒนาปรับปรุง",
            EN: "Plan for Development / Revision"
          },
          strategies: {
            TH: "กลยุทธ์",
            EN: "Strategies"
          },
          evidences: {
            TH: "หลักฐาน / ตัวบ่งชี้",
            EN: "Evidences / Indexes"
          }
        },
        save: {
          error: {
            plan: {
              TH: {
                TH: "กรุณาระบุแผนการพัฒนาปรับปรุง ( ภาษาไทย )",
                EN: "Please enter plan for development / revision ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุแผนการพัฒนาปรับปรุง ( ภาษาอังกฤษ )",
                EN: "Please enter plan for development / revision ( English Language )."
              }
            },
            strategies: {
              TH: {
                TH: "กรุณาระบุกลยุทธ์ ( ภาษาไทย )",
                EN: "Please enter strategies ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุกลยุทธ์ ( ภาษาอังกฤษ )",
                EN: "Please enter strategies ( English Language )."
              }
            },
            evidences: {
              TH: {
                TH: "กรุณาระบุหลักฐาน / ตัวบ่งชี้ ( ภาษาไทย )",
                EN: "Please enter evidences / indexes ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุหลักฐาน / ตัวบ่งชี้ ( ภาษาอังกฤษ )",
                EN: "Please enter evidences / indexes ( English Language )."
              }
            }
          }
        }
      },
      planQuantity: {
        table: {
          startYear: {
            TH: "กำหนดปีเริ่มต้น",
            EN: "Start Year"
          },
          numEp: [
            {
              id: "numEpReceive",
              name: {
                TH: "จำนวนที่คาดว่าจะรับ",
                EN: "The Number of Students Enrolled"
              }
            },
            {
              id: "numEpGraduate",
              name: {
                TH: "จำนวนที่คาดว่าจะจบ",
                EN: "The Number of Graduate Students"
              }
            },
            {
              id: "numEpTotal",
              name: {
                TH: "จำนวนสะสม",
                EN: "Cumulative Number"
              }
            }
          ]
        }
      },
      costBudget: [
        {
          id: "costDebit",
          table: {
            name: {
              TH: "ชื่อรายการรายจ่าย",
              EN: "Cost Name"
            }
          },
          save: {
            error: {
              name: {
                TH: {
                  TH: "กรุณาระบุชื่อรายการรายจ่าย ( ภาษาไทย )",
                  EN: "Please enter cost name ( Thai Language )."
                },
                EN: {
                  TH: "กรุณาระบุชื่อรายการรายจ่าย ( ภาษาอังกฤษ )",
                  EN: "Please enter cost name ( English Language )."
                }
              },
              amount: {
                TH: "กรุณาระบุจำนวนรายจ่าย",
                EN: "Please enter cost amount."
              }
            }
          }
        },
        {
          id: "costCredit",
          table: {
            name: {
              TH: "ชื่อรายการรายได้",
              EN: "Income Name"
            }
          },
          save: {
            error: {
              name: {
                TH: {
                  TH: "กรุณาระบุชื่อรายการรายได้ ( ภาษาไทย )",
                  EN: "Please enter income name ( Thai Language )."
                },
                EN: {
                  TH: "กรุณาระบุชื่อรายการรายได้ ( ภาษาอังกฤษ )",
                  EN: "Please enter income name ( English Language )."
                }
              },
              amount: {
                TH: "กรุณาระบุจำนวนรายได้",
                EN: "Please enter income amount."
              }
            }
          }
        }
      ],
      courseCategory: {
        TH: "ชุดรายวิชา",
        EN: "Courses in the Curriculum",
        generalCourses: {
          TH: "หมวดวิชาศึกษาทั่วไป",
          EN: "General Education Course"
        },
        specificCourses: {
          TH: "หมวดวิชาเฉพาะ",
          EN: "Specific Required Course"
        },
        electiveCourses: {
          TH: "หมวดวิชาเลือกเสรี",
          EN: "Elective Course"
        },
        course: [
          {
            id: "generalCourses"
          },
          {
            id: "specificCourses"
          }
        ],
        subjectGroup: {
          TH: "กลุ่มวิชา",
          EN: "Subject Group",
          table: {
            course: {
              TH: "หมวดวิชา",
              EN: "Course Category"
            },
            name: {
              TH: "ชื่อกลุ่มวิชา",
              EN: "Subject Group Name"
            }
          },
          save: {
            error: {
              course: {
                TH: "กรุณาเลือกหมวดวิชา",
                EN: "Please select course."
              },
              name: {
                TH: {
                  TH: "กรุณาระบุชื่อกลุ่มรายวิชา ( ภาษาไทย )",
                  EN: "Please enter subject group name ( Thai Language )."
                },
                EN: {
                  TH: "กรุณาระบุชื่อกลุ่มรายวิชา ( ภาษาอังกฤษ )",
                  EN: "Please enter subject group name ( English Language )."
                }
              },
              courseCredit: {
                TH: "กรุณาระบุจำนวนหน่วยกิต",
                EN: "Please enter course credit."
              }
            }
          }
        }
      },
      defineCourseCodes: {
        fourMainAlphabets: {
          TH: "ตัวอักษร 4 ตัว มีความหมาย",
          EN: "Four Main Alphabets are Defined as Follows",
          alphabetGroup: [
            {
              id: "firstTwoAlphabets",
              name: {
                TH: "ตัวอักษร 2 ตัวแรก เป็นอักษรย่อชื่อคณะ / สถาบันที่รับผิดชอบในการจัดการเรียนการสอน",
                EN: "The first two alphabets are abbreviation of the faculty offering the course"
              }
            },
            {
              id: "latterTwoAlphabets",
              name: {
                TH: "ตัวอักษร 2 ตัวหลัง เป็นอักษรย่อของภาควิชา / ชื่อรายวิชาหรือโครงการที่รับผิดชอบในการจัดการเรียนการสอน",
                EN: "The latter two alphabets are abbreviation of the department or the major offering the course"
              }
            }
          ]
        },
        threeDigitsFollowCourseInitials: {
          TH: "ตัวเลข 3 ตัว ตามหลังอักษรย่อของรายวิชา",
          EN: "3 Digits of Number are Following the Course Initials",
          digitGroup: [
            {
              name: {
                TH: "ตัวเลขตัวแรก หมายถึง ลำดับชั้นปีที่กำหนดให้ศึกษารายวิชานั้น ๆ",
                EN: "The first digit number indicate that the courses are in the graduate study level"
              }
            },
            {
              name: {
                TH: "ตัวเลข 2 ตัวหลัง หมายถึง ลำดับที่การเปิดรายวิชาในแต่ละหมวดหมู่ของรายวิชา",
                EN: "The latter two digits number indicate that the order in which courses are opened in each category of the course"
              }
            }
          ]
        },
        save: {
          error: {
            abbreviation: {
              TH: {
                TH: "กรุณาระบุอักษรย่อ ( ภาษาไทย )",
                EN: "Please enter abbreviation ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุอักษรย่อ ( ภาษาอังกฤษ )",
                EN: "Please enter abbreviation ( English Language )."
              }
            },
            meaning: {
              TH: {
                TH: "กรุณาระบุความหมาย ( ภาษาไทย )",
                EN: "Please enter meaning ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุความหมาย ( ภาษาอังกฤษ )",
                EN: "Please enter meaning ( English Language )."
              }
            }
          }
        }
      },
      specialCharacter: {
        table: {
          characteristics: {
            TH: "คุณลักษณะพิเศษ",
            EN: "Special Characteristics"
          },
          strategies: {
            TH: "กลยุทธ์การสอนหรือกิจกรรมนักศึกษา",
            EN: "Teaching Strategies or Student Activities"
          }
        },
        save: {
          error: {
            characteristics: {
              TH: {
                TH: "กรุณาระบุคุณลักษณะพิเศษ ( ภาษาไทย )",
                EN: "Please enter special characteristics ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุคุณลักษณะพิเศษ ( ภาษาอังกฤษ )",
                EN: "Please enter special characteristics ( English Language )."
              }
            },
            strategies: {
              TH: {
                TH: "กรุณาระบุกลยุทธ์การสอนหรือกิจกรรมนักศึกษา ( ภาษาไทย )",
                EN: "Please enter teaching strategies or student activities ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุกลยุทธ์การสอนหรือกิจกรรมนักศึกษา ( ภาษาอังกฤษ )",
                EN: "Please enter teaching strategies or student activities ( English Language )."
              }
            }
          }
        }
      },
      kpi: {
        TH: "ข้อมูลตัวบ่งชี้การดำเนินการ",
        EN: "Key Performance Indicators",
        initials: {
          TH: "KPI",
          EN: "KPI"
        },
        table: {
          startYear: {
            TH: "กำหนดปีเริ่มต้น",
            EN: "Start Year"
          },
          name: {
            TH: "ชื่อตัวบ่งชี้",
            EN: "Indicator Name"
          },
          indicator: [
            {
              id: "1",
              title: {
                TH: "อาจารย์ผู้รับผิดชอบหลักสูตรไม่น้อยกว่าร้อยละ 80 มีส่วนร่วมในการประชุมเพื่อวางแผน ติดตาม และทบทวนการดำเนินงานหลักสูตร",
                EN: "At least 80% of all full-time instructors in each program have to participate in meetings that set up plans to evaluate and revise the curriculum"
              }
            },
            {
              id: "2",
              title: {
                TH: "มีรายละเอียดหลักสูตร ตามแบบ มคอ. 2 ที่สอดคล้องกับกรอบมาตรฐานคุณวุฒิแห่งชาติ หรือมาตรฐานคุณวุฒิสาขา / สาขาวิชา ( ถ้ามี )",
                EN: "The program must have the details of the curriculum according to TQF2 which is associated with the Thai Qualifications Framework or the standards of the program ( if any )"
              }
            },
            {
              id: "3",
              title: {
                TH: "มีรายละเอียดของรายวิชา และมีรายละเอียดของประสบการณ์ภาคสนาม ( ถ้ามี ) ตามแบบ มคอ. 3 และ มคอ. 4 อย่างน้อยก่อนการเปิดสอนในแต่ละภาคการศึกษาให้ครบทุกรายวิชา",
                EN: "The program must have course specifications and field experience specifications ( if any ) according to TQF3 and TQF4 before the beginning of each trimester"
              }
            },
            {
              id: "4",
              title: {
                TH: "จัดทำรายงานผลการดำเนินการของรายวิชา และรายงานผลการดำเนินการของประสบการณ์ภาคสนาม ( ถ้ามี ) ตามแบบ มคอ. 5 และ มคอ. 6 ภายใน 30 วัน หลังสิ้นสุดภาคการศึกษาที่เปิดสอนให้ครบทุกรายวิชา",
                EN: "Instructors must produce course reports and file experience reports ( if any ) according to TQF5 and TQF6 within 30 days after the end of the trimester"
              }
            },
            {
              id: "5",
              title: {
                TH: "จัดทำรายงานผลการดำเนินงานของหลักสูตร ตามแบบ มคอ. 7 ภายใน 60 วัน หลังสิ้นสุดปีการศึกษา",
                EN: "Instructors must produce program reports according to TQF7 within 60 days after the end of the academic year"
              }
            },
            {
              id: "6",
              title: {
                TH: "มีการทวนผลสอบผลสัมฤทธิ์ของนักศึกษาตามมาตรฐานผลการเรียนรู้ ที่กำหนดใน มคอ. 3 และ มคอ. 4 ( ถ้ามี ) อย่างน้อยร้อยละ 25 ของรายวิชาที่เปิดสอนในแต่ละปีการศึกษา",
                EN: "Instructors must revise the grading of students according to learning standards indicated in TQF3 and TQF4 ( if any ) for at least 25 percent of courses that are offered each academic year"
              }
            },
            {
              id: "7",
              title: {
                TH: "มีการพัฒนา / ปรับปรุงการจัดการเรียนการสอน กลยุทธ์การสอน หรือการประเมินผลการเรียนรู้ จากผลการประเมินการดำเนินงานที่รายงานใน มคอ. 7 ปีที่แล้ว",
                EN: "Instructors must assess the development and / or improvement of teaching methods, teaching techniques or the grading system from the evaluation results in TQF7 of the previous year"
              }
            },
            {
              id: "8",
              title: {
                TH: "อาจารย์ใหม่ทุกคน ( ถ้ามี ) ได้รับการปฐมนิเทศหรือคำแนะนำด้านการจัดการเรียนการสอน",
                EN: "Every new instructor ( if any ) has to participate in the orientation and receive adequate information on the college’s teaching requirements"
              }
            },
            {
              id: "9",
              title: {
                TH: "อาจารย์ประจำทุกคนได้รับการพัฒนาทางวิชาการ และ / หรือวิชาชีพ อย่างน้อยปีละ 1 ครั้ง",
                EN: "Full-time instructors must demonstrate academic and / or profession improvement at least once a year"
              }
            },
            {
              id: "10",
              title: {
                TH: "จำนวนบุคลากรสนับสนุนการเรียนการสอน ( ถ้ามี ) ได้รับการพัฒนาทางวิชาการ และ / หรือวิชาชีพ ไม่น้อยกว่าร้อยละ 50",
                EN: "The number of supporting staff ( if any ) who demonstrate academic and / or professional improvement by at least 50 percent each year"
              }
            },
            {
              id: "11",
              title: {
                TH: "ระดับความพึงพอใจของนักศึกษาปีสุดท้าย / บัณฑิตที่มีต่อคุณภาพหลักสูตร เฉลี่ยไม่น้อยกว่า 3.5 จากคะแนนเต็ม 5.0",
                EN: "The level of satisfaction from the previous year’s students and new graduates toward curriculum quality, with an average score of at least 3.5 out of 5"
              }
            },
            {
              id: "12",
              title: {
                TH: "ระดับความพึงพอใจของผู้ใช้บัณฑิตที่มีต่อบัณฑิตใหม่ เฉลี่ยไม่น้อยกว่า 3.5 จากคะแนนเต็ม 5.0",
                EN: "The level of satisfaction from employers of new graduates with an average score of at least 3.5 out of 5"
              }
            }
          ]
        },
        save: {
          error: {
            name: {
              TH: {
                TH: "กรุณาระบุชื่อตัวบ่งชี้ ( ภาษาไทย )",
                EN: "Please enter indicator name ( Thai Language )."
              },
              EN: {
                TH: "กรุณาระบุชื่อตัวบ่งชี้ ( ภาษาอังกฤษ )",
                EN: "Please enter indicator name ( English Language )."
              }
            }
          }
        }
      },
      program: {
        TH: "ข้อมูลหลักสูตร",
        EN: "Program",
        programNotFound: {
          TH: "ไม่พบข้อมูลหลักสูตร",
          EN: "Program not found."
        },
        edit: {
          TH: "แก้ไขหลักสูตร",
          EN: "Edit Program"
        },
        update: {
          TH: "ปรับปรุงหลักสูตร",
          EN: "Update Program"
        },
        table: {
          faculty: {
            TH: "คณะ",
            EN: "Faculty"
          },
          code: {
            TH: "รหัสหลักสูตร",
            EN: "Program Code"
          },
          name: {
            TH: "ชื่อหลักสูตร",
            EN: "Program Name"
          },
          degree: {
            TH: "ชื่อปริญญา",
            EN: "Degree"
          },
          degreeInitials: {
            TH: "ชื่อย่อปริญญา",
            EN: "Degree Initials"
          },
          courseYear: {
            TH: "ปีหลักสูตร",
            EN: "Course Year"
          },
          mode: {
            TH: "ประเภท",
            EN: "Mode"
          },
          majorSubject: {
            TH: "วิชาเอก",
            EN: "Major Subject"
          },
          credits: {
            TH: "จำนวนหน่วยกิตไม่น้อยกว่า",
            EN: "Number of Credits Not Less Than"
          },
          programModel: {
            TH: "รูปแบบของหลักสูตร",
            EN: "Program Model"
          },
          programType: {
            TH: "ประเภทของหลักสูตร",
            EN: "Program Type"
          },
          language: {
            TH: "ภาษาที่ใช้",
            EN: "Language"
          },
          admissionType: {
            TH: "การรับเข้าศึกษา",
            EN: "Admission Type"
          },
          cooperationType: {
            TH: "ความร่วมมือกับสถาบันอื่น",
            EN: "Collaboration with Other Universities"
          },
          cooperationPattern: {
            TH: "รูปแบบความร่วมมือ",
            EN: "Types of Collaboration"
          },
          graduateType: {
            TH: "การให้ปริญญาแก่ผู้สำเร็จการศึกษา",
            EN: "Graduate Degrees Offered to the Graduates"
          },
          courseManagement: {
            TH: "การจัดการหลักสูตร",
            EN: "Course Management"
          },
          revisedProgram: {
            TH: "เป็นหลักสูตรปรับปรุง",
            EN: "Revised Program",
            courseYear: {
              TH: "พ.ศ.",
              EN: "B.E."
            },
            prevCourseYear: {
              TH: "ปรับปรุงจาก",
              EN: "Updated From"
            }
          },
          programStarted: {
            TH: "เปิดสอน",
            EN: "Program has Started"
          },
          approvedStatus: {
            meetingTime: {
              TH: "ประชุมครั้งที่",
              EN: "Meeting Time"
            },
            meetingOn: {
              TH: "ประชุมเมื่อวันที่",
              EN: "Meeting On"
            }
          },
          philosopyCourse: {
            TH: "ปรัชญา ความสำคัญของหลักสูตร",
            EN: "Philosophy and Justification of the Curriculum"
          },
          programObjectives: {
            TH: "วัตถุประสงค์ของหลักสูตร",
            EN: "Program Objectives"
          },
          plos: {
            TH: "ผลลัพธ์การเรียนรู้ระดับหลักสูตร",
            EN: "Program Learning Outcomes ( PLOs )"
          },
          eduSystem: {
            TH: "ระบบ",
            EN: "System"
          },
          summer: {
            TH: "การจัดการศึกษาภาคฤดูร้อน",
            EN: "Summer Session"
          },
          compareCredit: {
            TH: "การเทียบเคียงหน่วยกิตทวิภาค",
            EN: "Credit Equivalence to Semester System"
          },
          planQuantity: {
            TH: "แผนการรับนักศึกษาและผู้สำเร็จการศึกษาในระยะ 5 ปี",
            EN: "Five-Year-Plan for Recruitment and Graduation of Students"
          },
          budgetPlan: {
            TH: "งบประมาณตามแผน",
            EN: "Budget Based On the Plan",
            investment: {
              TH: "ด้านการลงทุน",
              EN: "Investment",
              costValue: {
                TH: "ความคุ้มทุน / ความคุ้มค่า",
                EN: "Cost / Value",
                incomeStudent: {
                  TH: "รายรับต่อคน / ตลอดหลักสูตร",
                  EN: "Income per student"
                },
                costStudent: {
                  TH: "รายจ่ายต่อคน / ตลอดหลักสูตร",
                  EN: "Cost per student"
                },
                costEffective: {
                  TH: "จำนวนนักศึกษาน้อยที่สุดที่คุ้มทุน",
                  EN: "Number of students at break-even point"
                },
                studentsEnrolled: {
                  TH: "จำนวนนักศึกษาที่คาดว่าจะรับ",
                  EN: "Number of students enrolled"
                },
                notCostEffective: {
                  TH: "ในกรณีที่หลักสูตรที่ไม่คุ้มทุนแต่เกิดความคุ้มค่า เนื่องจาก",
                  EN: "In the event that the course is not cost-effective but is worthwhile due to"
                }
              },
              costBudget: {
                TH: "การคิดงบประมาณค่าใช้จ่ายในการผลิตบัณฑิต",
                EN: "Budgeting the cost of producing graduates",
                costDebit: {
                  TH: "ค่าใช้จ่ายในการผลิตบัณฑิต",
                  EN: "Cost of producing graduates"
                },
                costCredit: {
                  TH: "รายได้จากค่าธรรมเนียมการศึกษาและอื่น ๆ",
                  EN: "Income from education fees and others"
                }
              }
            }
          },
          eduStudyType: {
            TH: "ระบบการศึกษา",
            EN: "Educational System"
          },
          creditTransfer: {
            TH: "การเทียบโอนหน่วยกิต รายวิชา และการลงทะเบียนเรียนข้ามมหาวิทยาลัย ( ถ้ามี )",
            EN: "Transfer of Credits, Courses and Cross University Registration ( If any )"
          },
          curriculum: {
            TH: "หลักสูตร",
            EN: "Curriculum",
            totalCredits: {
              TH: "จำนวนหน่วยกิตรวมตลอดหลักสูตรไม่น้อยกว่า",
              EN: "Number of Credits ( not less than )"
            },
            curriculumStructure: {
              TH: "โครงสร้างหลักสูตร",
              EN: "Curriculum Structure"
            },
            definedCourseCodes: {
              TH: "ความหมายของรหัสรายวิชา",
              EN: "Definition of Course Codes"
            },
            studyPlan: {
              TH: "แผนการศึกษา",
              EN: "Study Plan"
            }
          },
          instructor: {
            TH: "ชื่อ นามสกุล, เลขประจำตัวบัตรประชาชน, ตำแหน่ง, คุณวุฒิการศึกษาของอาจารย์",
            EN: "Name, ID Number, Title and Degree of Instructors"
          },
          kpi: {
            TH: "ตัวบ่งชี้การดำเนินการ",
            EN: "Key Performance Indicators"
          },
          verifyStatus: {
            TH: "สถานะ",
            EN: "Status"
          }
        },
        verify: {
          TH: "ข้อมูลหลักสูตร : อนุมัติ",
          EN: "Program : Verify"
        },
        reject: {
          TH: "ข้อมูลหลักสูตร : ไม่อนุมัติ",
          EN: "Program : Reject"
        },
        sendVerify: {
          TH: "ข้อมูลหลักสูตร : ส่งอนุมัติ",
          EN: "Program : Send Verify"
        }
      },
      TQFInfo: {
        TH: "ข้อมูล มคอ.",
        EN: "TQF Info",
        fullname: {
          TH: "กรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติ",
          EN: "Thai Qualifications Framework for Higher Education"
        }
      },
      TQF1: {
        TH: "มคอ. 1",
        EN: "TQF1",
        mean: {
          TH: "มาตราฐานคุณวุฒิระดับ.....สาขา/สาขาวิชา.....",
          EN: "Standard Qualification of Program"
        }
      },
      TQF2: {
        TH: "มคอ. 2",
        EN: "TQF2",
        mean: {
          TH: "รายละเอียดของหลักสูตร",
          EN: "Programme Specification"
        },
        verify: {
          verified: {
            TH: "หลักสูตรที่อนุมัติแล้ว",
            EN: "Verified Program"
          },
          pendingVerify: {
            TH: "หลักสูตรที่รออนุมัติ",
            EN: "Pending Verify Program"
          },
          sendingVerify: {
            TH: "หลักสูตรที่รอส่งอนุมัติ",
            EN: "Sending Verify Program"
          }
        },
        group1: {
          TH: "หมวด&nbsp;1",
          EN: "Group&nbsp;1",
          mean: {
            TH: "ข้อมูลทั่วไป",
            EN: "General Information"
          },
          section: {
            1: {
              TH: "รหัสและชื่อหลักสูตร",
              EN: "Curriculum Name",
              description: {
                code: {
                  TH: "ความยาว 5 ตัวอักษร",
                  EN: "5 Characters Long"
                }
              },
              save: {
                error: {
                  code: {
                    TH: "กรุณาระบุรหัสความยาว 5 ตัวอักษร",
                    EN: "Please enter code, 5 character long."
                  },
                  name: {
                    TH: {
                      TH: "กรุณาระบุชื่อ ( ภาษาไทย )",
                      EN: "Please enter name ( Thai Language )."
                    },
                    EN: {
                      TH: "กรุณาระบุชื่อ ( ภาษาอังกฤษ )",
                      EN: "Please enter name ( English Language )."
                    }
                  }
                }
              }
            },
            2: {
              TH: "ชื่อปริญญาและสาขาวิชา",
              EN: "Name of Degree and Major",
              save: {
                error: {
                  degreeName: {
                    TH: {
                      TH: "กรุณาระบุชื่อเต็ม ( ภาษาไทย )",
                      EN: "Please enter full name ( Thai Language )."
                    },
                    EN: {
                      TH: "กรุณาระบุชื่อเต็ม ( ภาษาอังกฤษ )",
                      EN: "Please enter full name ( English Language )."
                    }
                  },
                  degreeAbbrev: {
                    TH: {
                      TH: "กรุณาระบุชื่อย่อ ( ภาษาไทย )",
                      EN: "Please enter initials ( Thai Language )."
                    },
                    EN: {
                      TH: "กรุณาระบุชื่อย่อ ( ภาษาอังกฤษ )",
                      EN: "Please enter initials ( English Language )."
                    }
                  }
                }
              }
            },
            3: {
              TH: "วิชาเอก ( ถ้ามี )",
              EN: "Major Subjects ( if any )"
            },
            4: {
              TH: "จำนวนหน่วยกิตที่เรียนตลอดหลักสูตร",
              EN: "Required Credits"
            },
            5: {
              TH: "รูปแบบของหลักสูตร",
              EN: "Curriculum Characteristics"
            },
            6: {
              TH: "สถานภาพของหลักสูตรและการพิจารณาอนุมัติ / เห็นชอบหลักสูตร",
              EN: "Curriculum Status and Curriculum Approval"
            },
            7: {
              TH: "ความพร้อมในการเผยแพร่หลักสูตรที่มีคุณภาพและมาตรฐาน",
              EN: "Readiness to Implement / Promote the Curriculum",
              save: {
                error: {
                  courseYear: {
                    TH: "กรุณาระบุปีหลักสูตร",
                    EN: "Please enter course year."
                  }
                }
              }
            },
            8: {
              TH: "อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา",
              EN: "Opportunities of the Graduates"
            },
            9: {
              TH: "ชื่อ นามสกุล เลขประจำตัวบัตรประชาชน ตำแหน่ง คุณวุฒิการศึกษา ของอาจารย์ผู้รับผิดชอบหลักสูตร",
              EN: "Name, ID Number, Title and Degree of the Faculty in Charge of the Program"
            },
            10: {
              TH: "สถานที่จัดการเรียนการสอน",
              EN: "Venue for Instruction"
            },
            11: {
              TH: "สถานการณ์ภายนอกหรือการพัฒนาที่จำเป็นต้องนำมาพิจารณาในการวางแผนหลักสูตร",
              EN: "External Factors to Be Considered in Curriculum Planning"
            },
            12: {
              TH: "ผลกระทบต่อการพัฒนาหลักสูตรและเกี่ยวข้องกับพันธกิจของสถาบัน",
              EN: "The Effects Mentioned in No.11.1 and 11.2 on Curriculum Development and Relevance to the Missions of the University / Institution"
            },
            13: {
              TH: "ความสัมพันธ์กับหลักสูตรอื่นที่เปิดสอนในคณะ / ภาควิชาอื่นของสถาบัน",
              EN: "Collaboration with Other Curricula of the University ( if any )"
            }
          }
        },
        group2: {
          TH: "หมวด&nbsp;2",
          EN: "Group&nbsp;2",
          mean: {
            TH: "ข้อมูลเฉพาะของหลักสูตร",
            EN: "Information of the Curriculum"
          },
          section: {
            1: {
              TH: "ปรัชญา ความสำคัญ และวัตถุประสงค์ของหลักสูตร",
              EN: "Philosophy, Justification, and Objectives of the Curriculum"
            },
            2: {
              TH: "แผนการพัฒนาปรับปรุง",
              EN: "Plan for Development and Improvement"
            }
          }
        },
        group3: {
          TH: "หมวด&nbsp;3",
          EN: "Group&nbsp;3",
          mean: {
            TH: "ระบบการจัดการศึกษา การดำเนินการ และโครงสร้างหลักสูตร",
            EN: "Educational Management System, Curriculum Implementation, and Structure"
          },
          section: {
            1: {
              TH: "ระบบการจัดการศึกษา",
              EN: "Educational Management System"
            },
            2: {
              TH: "การดำเนินการหลักสูตร",
              EN: "Curriculum Implementation"
            },
            3: {
              TH: "หลักสูตรและอาจารย์ผู้สอน",
              EN: "Curriculum and Instructors"
            }
          }
        },
        group4: {
          TH: "หมวด&nbsp;4",
          EN: "Group&nbsp;4",
          mean: {
            TH: "ผลการเรียนรู้ของหลักสูตร กลยุทธ์การสอนและประเมินผล",
            EN: "Learning Outcome, Teaching Strategies and Evaluation"
          },
          section: {
            1: {
              TH: "การพัฒนาคุณลักษณะพิเศษของนักศึกษา",
              EN: "Development of Students’ Specific Qualifications"
            },
            2: {
              TH: "ผลลัพธ์การเรียนรู้ระดับหลักสูตร ( PLOs ) กลยุทธ์การสอน และการประเมินผล",
              EN: "Development of Learning Outcome in Each Objective"
            }
          }
        },
        group5: {
          TH: "หมวด&nbsp;5",
          EN: "Group&nbsp;5",
          mean: {
            TH: "หลักเกณฑ์ในการประเมินผลนักศึกษา",
            EN: "Criteria for Student Evaluation"
          }
        },
        group6: {
          TH: "หมวด&nbsp;6",
          EN: "Group&nbsp;6",
          mean: {
            TH: "การพัฒนาคณาจารย์",
            EN: "Faculty Development"
          }
        },
        group7: {
          TH: "หมวด&nbsp;7",
          EN: "Group&nbsp;7",
          mean: {
            TH: "การประกันคุณภาพหลักสูตร",
            EN: "Quality Assurance"
          }
        },
        group8: {
          TH: "หมวด&nbsp;8",
          EN: "Group&nbsp;8",
          mean: {
            TH: "การประเมินและการปรับปรุงการดำเนินการของหลักสูตร",
            EN: "Evaluation and Improvement of the Curriculum Implementation"
          }
        }
      },
      TQF3: {
        TH: "มคอ. 3",
        EN: "TQF3",
        mean: {
          TH: "รายละเอียดของรายวิชา",
          EN: "Course Specification"
        },
        verify: {
          verified: {
            TH: "หลักสูตรที่อนุมัติแล้ว",
            EN: "Verified Program"
          },
          pendingVerify: {
            TH: "หลักสูตรที่รออนุมัติ",
            EN: "Pending Verify Program"
          },
          sendingVerify: {
            TH: "หลักสูตรที่รอส่งอนุมัติ",
            EN: "Sending Verify Program"
          }
        },
        group1: {
          TH: "หมวด&nbsp;1",
          EN: "Group&nbsp;1",
          mean: {
            TH: "ข้อมูลทั่วไป",
            EN: "General Information"
          },
          section: {
            1: {
              TH: "รหัสและชื่อรายวิชา",
              EN: "Course Code and Title"
            },
            2: {
              TH: "จำนวนหน่วยกิต",
              EN: "Number of Credit"
            },
            3: {
              TH: "หลักสูตรและประเภทของรายวิชา",
              EN: "Curriculum and Type of Subject"
            },
            4: {
              TH: "การจัดในกลุ่ม Literacy",
              EN: "Literacy Grouping"
            },
            5: {
              TH: "อาจารย์ผู้รับผิดชอบรายวิชาและอาจารย์ผู้สอน",
              EN: "Responsible Faculty Member"
            },
            6: {
              TH: "ภาคการศึกษาที่เปิดสอน / ปีการศึกษาที่เปิดสอน / จำนวนผู้เรียนที่รับได้",
              EN: "Semester / Year of Study / Number of Students"
            },
            7: {
              TH: "รายวิชาที่ต้องเรียนมาก่อน",
              EN: "Pre-requisite"
            },
            8: {
              TH: "รายวิชาที่ต้องเรียนพร้อมกัน",
              EN: "Co-requisite"
            },
            9: {
              TH: "สถานที่เรียน",
              EN: "Venue of Study"
            },
            10: {
              TH: "วันที่จัดทำหรือปรับปรุงรายละเอียดของรายวิชาครั้งล่าสุด",
              EN: "Last Updated of the Course Details"
            }
          }
        },
        group2: {
          TH: "หมวด&nbsp;2",
          EN: "Group&nbsp;2",
          mean: {
            TH: "จุดมุ่งหมายและวัตถุประสงค์",
            EN: "Goals and Objectives"
          }
        },
        group3: {
          TH: "หมวด&nbsp;3",
          EN: "Group&nbsp;3",
          mean: {
            TH: "ลักษณะและการดำเนินการ",
            EN: "Description and Implementation"
          }
        },
        group4: {
          TH: "หมวด&nbsp;4",
          EN: "Group&nbsp;4",
          mean: {
            TH: "การพัฒนาผลการเรียนรู้ที่คาดหวังระดับรายวิชาของนักศึกษา",
            EN: "Course Learning Outcomes Development"
          }
        },
        group5: {
          TH: "หมวด&nbsp;5",
          EN: "Group&nbsp;5",
          mean: {
            TH: "แผนการสอนและการประเมินผล",
            EN: "Teaching and Evaluation Plan"
          }
        },
        group6: {
          TH: "หมวด&nbsp;6",
          EN: "Group&nbsp;6",
          mean: {
            TH: "ทรัพยากรประกอบการเรียนการสอน",
            EN: "Teaching Materials"
          }
        },
        group7: {
          TH: "หมวด&nbsp;7",
          EN: "Group&nbsp;7",
          mean: {
            TH: "การประเมินและปรับปรุงการดำเนินการของรายวิชา",
            EN: "Course Evaluation and Improvement"
          }
        }
      },
      TQF4: {
        TH: "มคอ. 4",
        EN: "TQF4",
        mean: {
          TH: "รายละเอียดของประสบการณ์ภาคสนาม",
          EN: "Field Experience Specification"
        }
      },
      TQF5: {
        TH: "มคอ. 5",
        EN: "TQF5",
        mean: {
          TH: "รายงานผลการดำเนินการของรายวิชา",
          EN: "Course Report"
        }
      },
      TQF6: {
        TH: "มคอ. 6",
        EN: "TQF6",
        mean: {
          TH: "รายงานผลการดำเนินการของประสบการณ์ภาคสนาม",
          EN: "Field Experience Report"
        }
      },
      TQF7: {
        TH: "มคอ. 7",
        EN: "TQF7",
        mean: {
          TH: "รายงานผลการดำเนินการของหลักสูตร",
          EN: "Programme Report"
        }
      },
      configuration: {
        TH: "ตั้งค่า",
        EN: "Configuration"
      },
      HRi: {
        personalInformation: {
          TH: "ข้อมูลบุคลากร",
          EN: "Personal Information",
          educationNotFound: {
            TH: "ไม่พบข้อมูลระดับการศึกษา",
            EN: "Education data not found."
          },
          coursePositionNotFound: {
            TH: "ไม่พบข้อมูลตำแหน่งในหลักสูตร",
            EN: "Position in the course not found."
          }
        },
        personalData: {
          TH: "ข้อมูลพื้นฐานของบุคลากร",
          EN: "Personal Data"
        },
        table: {
          fullName: {
            TH: "ชื่อ - สกุล",
            EN: "Full Name"
          },
          department: {
            TH: "ส่วนงาน",
            EN: "Department"
          },
          personalId: {
            TH: "รหัสของบุคลากร",
            EN: "Personal ID"
          },
          namePrefix: {
            academicPosition: {
              TH: "ตำแหน่งทางวิชาการ",
              EN: "Academic Position"
            },
            military: {
              TH: "ทางทหาร",
              EN: "Military"
            },
            profession: {
              TH: "วิชาชีพ",
              EN: "Profession"
            },
            titleConferredByTheKing: {
              TH: "ราชทินนาม",
              EN: "Title Conferred By The King"
            },
            ordinary: {
              TH: "สามัญ",
              EN: "Ordinary"
            }
          },
          gender: {
            TH: "เพศ",
            EN: "Gender"
          },
          firstNameTH: {
            TH: "ชื่อ ( ภาษาไทย )",
            EN: "First Name ( TH )"
          },
          middleNameTH: {
            TH: "ชื่อกลาง ( ภาษาไทย )",
            EN: "Middle Name ( TH )"
          },
          lastNameTH: {
            TH: "นามสกุล ( ภาษาไทย )",
            EN: "Last Name ( TH )"
          },
          firstNameEN: {
            TH: "ชื่อ ( ภาษาอังกฤษ )",
            EN: "First Name ( EN )"
          },
          middleNameEN: {
            TH: "ชื่อกลาง ( ภาษาอังกฤษ )",
            EN: "Middle Name ( EN )"
          },
          lastNameEN: {
            TH: "นามสกุล ( ภาษาอังกฤษ )",
            EN: "Last Name ( EN )"
          },
          dateOfBirth: {
            TH: "วันเกิด",
            EN: "Date of Birth"
          },
          countryOfBirth: {
            TH: "ประเทศที่เกิด",
            EN: "Country of birth"
          },
          placeOfBirth: {
            TH: "สถานที่เกิด",
            EN: "Place of Birth"
          },
          nationality: {
            TH: "เชื้อชาติ",
            EN: "Nationality"
          },
          nationalitySecond: {
            TH: "เชื้อชาติที่สอง",
            EN: "Nationality ( Second )"
          },
          nationalityThird: {
            TH: "เชื้อชาติที่สาม",
            EN: "Nationality ( Third )"
          },
          religious: {
            TH: "ศาสนา",
            EN: "Religious"
          },
          maritalStatus: {
            TH: "สถานภาพทางการสมรส",
            EN: "Marital Status"
          },
          positions: {
            TH: "ข้อมูลตําแหน่งและส่วนงานที่สังกัด",
            EN: "Position Data",
            id: {
              TH: "รหัสตําแหน่ง",
              EN: "Position ID"
            },
            name: {
              TH: "ชื่อตําแหน่ง",
              EN: "Position Name"
            },
            fullName: {
              TH: "ชื่อตําแหน่งแบบเต็ม",
              EN: "Position Full Name"
            },
            type: {
              TH: "ประเภทตําแหน่ง",
              EN: "Position Type"
            },
            startDate: {
              TH: "วันที่รับตําแหน่ง",
              EN: "Start Date"
            },
            organization: {
              TH: "ส่วนงานที่สังกัด",
              EN: "Organization",
              id: {
                TH: "รหัสส่วนงาน",
                EN: "Organization ID"
              },
              name: {
                TH: "ชื่อส่วนงาน",
                EN: "Organization Name"
              },
              fullName: {
                TH: "ชื่อส่วนงานแบบเต็ม",
                EN: "Organization Full Name"
              },
              faculty: {
                TH: "คณะ / สํานัก ที่สังกัด",
                EN: "Faculty",
                id: {
                  TH: "รหัสคณะ / สํานัก",
                  EN: "Faculty ID"
                },
                name: {
                  TH: "ชื่อคณะ / สํานัก",
                  EN: "Faculty Name"
                },
                fullName: {
                  TH: "ชื่อคณะ / สํานักแบบเต็ม",
                  EN: "Faculty Full Name"
                }
              }
            }
          },
          educations: {
            TH: "ข้อมูลระดับการศึกษา",
            EN: "Education Data",
            educationType: {
              TH: "ระดับการศึกษา",
              EN: "Education Type"
            },
            institute: {
              TH: "สถาบันการศึกษา",
              EN: "Institute"
            },
            country: {
              TH: "ประเทศของสถาบันการศึกษา",
              EN: "Country"
            },
            training: {
              TH: "ประเภทของทุนหรือเกียรตินิยม",
              EN: "Training"
            },                        
            status: {
              TH: "สถานะของวุฒิการศึกษา",
              EN: "Status"
            },
            branch: {
              1: {
                TH: "สาขา 1",
                EN: "Branch 1"
              },
              2: {
                TH: "สาขา 2",
                EN: "Branch 2"
              }
            },
            certificate: {
              TH: "วุฒิการศึกษา",
              EN: "Certificate"
            },
            graduateYear: {
              TH: "ปีที่สำเร็จการศึกษา",
              EN: "Graduate Year"
            },
            finalGrade: {
              TH: "เกรดเฉลี่ย",
              EN: "Final Grade"
            }
          }
        },
        searchExample: {
          TH: "ตัวอย่างการค้นหา",
          EN: "Search Example",
          format: [
            {
              TH: "ชื่อและนามสกุล",
              EN: "First & Last Name",
              sample: "ยุทธภูมิ, ตวันนา"
            },
            {
              TH: "ชื่อเท่านั้น",
              EN: "First Name Only",
              sample: "ยุทธภูมิ"
            },
            {
              TH: "นามสกุลเท่านั้น",
              EN: "Last Name Only",
              sample: ", ตวันนา"
            }
          ]
        }
      }
    };
  });
})();