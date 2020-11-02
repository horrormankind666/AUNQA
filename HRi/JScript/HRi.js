/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๓/๐๙/๒๕๖๒>
Modify date : <๒๔/๐๙/๒๕๖๒>
Description : <รวมรวบฟังก์ชั่นใช้งานสำหรับข้อมูลบุคลากร>
=============================================
*/

(function () {
  "use strict";

  angular.module("hriMod", [
    "utilMod"
  ])

  .service("hriServ", function ($q, $filter, utilServ) {
    var self = this;

    self.pathAPI = "";

    self.getDataSource = function (param) {
      param.action = (param.action === undefined ? "" : param.action);
      param.params = (param.params === undefined || param.params === "" ? {} : param.params);

      var deferred = $q.defer();
      var url = (utilServ.getURLAPI(self.pathAPI) + "HRi/");
      var route = "";

      switch (param.action) {
        case "getlist": {
          route = "GetListData";
          break;
        }
        case "get": {
          route = "GetData";
          break;
        }
      }

      url += (route + "?ver=" + utilServ.dateTimeOnURL);

      utilServ.http({
        url: url,
        method: "POST",
        data: param.params
      }).then(function (result) {
        var dt = [];
        var positions = [];
        var programs = [];
        var educations = [];

        angular.forEach(result.data.data.content, function (item) {
          if (param.action === "getlist") {
            dt.push({
              personalId: (item.personalId ? item.personalId : ""),
              firstName: {
                TH: (item.firstName ? item.firstName : ""),
                EN: (item.firstNameEn ? $filter("capitalize")(item.firstNameEn) : "")
              },
              lastName: {
                TH: (item.lastName ? item.lastName : ""),
                EN: (item.lastNameEn ? $filter("capitalize")(item.lastNameEn) : "")
              },
              department: {
                TH: (item.department ? item.department : ""),
                EN: (item.departmentEn ? $filter("capitalize")(item.departmentEn) : "")
              },
              selectFilter: (
                (item.firstName ? item.firstName : "") +
                (item.lastName ? item.lastName : "") +
                (item.firstNameEn ? item.firstNameEn : "") +
                (item.lastNameEn ? item.lastNameEn : "") +
                (item.department ? item.department : "") +
                (item.departmentEn ? item.departmentEn : "")
              )
            });
          }

          if (param.action === "get") {
            angular.forEach(item.positions, function (position) {
              positions.push({
                name: (position.name ? position.name : ""),
                fullName: (position.fullname ? $filter("capitalize")(position.fullname) : ""),
                type: (position.type ? position.type : ""),
                startDate: (position.startDate ? position.startDate : ""),
                organization: {
                  name: (position.organization && position.organization.name ? position.organization.name : ""),
                  fullName: (position.organization && position.organization.fullname ? $filter("capitalize")(position.organization.fullname) : ""),
                  faculty: {
                    name: (position.organization && position.organization.faculty.name ? position.organization.faculty.name : ""),
                    fullName: (position.organization && position.organization.faculty.fullname ? $filter("capitalize")(position.organization.faculty.fullname) : "")
                  }
                }
              });
            });

            angular.forEach(item.programs, function (program) {
              programs.push({
                id: (program.id ? program.id : ""),
                faculty: {
                  id: (program.facultyId ? program.facultyId : ""),
                  name: {
                    TH: (program.facultyNameTH ? program.facultyNameTH : ""),
                    EN: (program.facultyNameEN ? $filter("capitalize")(program.facultyNameEN) : "")
                  }
                },
                programId: (program.programId ? program.programId : ""),
                programCode: (program.programCode ? program.programCode : ""),
                programFullCode: ((program.programCode ? (program.programCode + " ") : "") + (program.majorCode ? (program.majorCode + " ") : "") + (program.groupNum ? program.groupNum : "")),
                majorId: (program.majorId ? program.majorId : ""),
                majorCode: (program.majorCode ? program.majorCode : ""),
                groupNum: (program.groupNum ? program.groupNum : ""),
                name: {
                  TH: (program.nameTh ? program.nameTh : ""),
                  EN: (program.nameEn ? $filter("capitalize")(program.nameEn) : "")
                },
                courseYear: (program.courseYear ? program.courseYear : ""),
                cancelStatus: (program.cancelStatus ? program.cancelStatus : ""),
                coursePosition: {
                  id: (program.coursePositionId ? program.coursePositionId : ""),
                  name: {
                    TH: (program.coursePositionNameTH ? program.coursePositionNameTH : ""),
                    EN: (program.coursePositionNameEN ? program.coursePositionNameEN : ""),
                  },
                  group: (program.coursePositionGroup ? program.coursePositionGroup : "")
                }
              });
            });
                        
            angular.forEach(item.educations, function (education) {
              educations.push({
                educationType: (education.educationType ? education.educationType : ""),
                institute: (education.institute ? education.institute : ""),
                training: (education.training ? education.training : ""),
                country: (education.country ? education.country : ""),
                status: (education.status ? education.status : ""),
                branch1: (education.branch1 ? education.branch1 : ""),
                branch2: (education.branch2 ? education.branch2 : ""),
                certificate: (education.certificate ? education.certificate : ""),
                finalGrade: (education.finalGrade ? education.finalGrade : ""),
                graduateYear: (education.graduateYear ? education.graduateYear : "")
              });
            });

            dt.push({
              personalId: (item.personalId ? item.personalId : ""),
              namePrefix: {
                academicPosition: (item.titleZ ? item.titleZ : ""),
                military: (item.titleS ? item.titleS : ""),
                profession: (item.titleV ? item.titleV : ""),
                titleConferredByTheKing: (item.titleT ? item.titleT : ""),
                ordinary: (item.title ? item.title : "")
              },
              gender: (item.gender ? item.gender : ""),
              firstName: {
                TH: (item.firstName ? item.firstName : ""),
                EN: (item.firstNameEn ? $filter("capitalize")(item.firstNameEn) : "")
              },
              middleName: {
                TH: (item.middleName ? item.middleName : ""),
                EN: (item.middleNameEn ? $filter("capitalize")(item.middleNameEn) : "")
              },
              lastName: {
                TH: (item.lastName ? item.lastName : ""),
                EN: (item.lastNameEn ? $filter("capitalize")(item.lastNameEn) : "")
              },
              dateOfBirth: (item.birthDate ? item.birthDate : ""),
              countryOfBirth: (item.birthCountry ? $filter("capitalize")(item.birthCountry) : ""),
              placeOfBirth: (item.birthPlace ? $filter("capitalize")(item.birthPlace) : ""),
              nationality: (item.nationality ? $filter("capitalize")(item.nationality) : ""),
              nationalitySecond: (item.nationalitySecond ? $filter("capitalize")(item.nationalitySecond) : ""),
              nationalityThird: (item.nationalityThird ? $filter("capitalize")(item.nationalityThird) : ""),
              religious: (item.religious ? item.religious : ""),
              maritalStatus: (item.marital ? item.marital : ""),
              positions: positions,
              programs: programs,
              educations: educations
            });                        
          }
        });

        if (param.action === "getlist") {
          var output = [];
          var keys = [];

          angular.forEach(dt, function (item) {
            var key = item.personalId;

            if (keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
            }
          });

          dt = output;
        }
                
        deferred.resolve(dt);
      });

      return deferred.promise;
    };
  });
})();