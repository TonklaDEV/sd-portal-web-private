export interface EnvironmentOptions {
  readonly production: boolean;
}

//save sectionOne data
export interface CreateSectionOne {
  userId: number;
  dateSave: string;
  day: number;
  courseId: number;
  action: string;
  actionDate: string;
  approve1_id: number;
  approve2_id: number;
  approve3_id: number;
  approve4_id: number;
  budget: number;
  fileID : number[];
}

export interface SectionTwo {
  sectionOne_id: number; // id ของsectionTwo
  approver_id: number; // id ของตาราง user
  result_id: number; // id ของตาราง result จะมี id , result1-7 , result() , cause , comment , plan
}

export interface Course {
  id: number;
  courseName: string;
  startDate: string;
  endDate: string;
  time: string;
  note: string;
  price: number;
  priceProject: number;
  place: string;
  institute: string;
  active: string;
  type: string;
}

// export interface allDeptCompany {
//   company : string;
//   sectorname : string;
//   sectorcode : string;
//   deptname  : string;
//   deptcode  : string;
// }

export interface allDeptCompany {
  company: string;
  sectors: Sectors[];
}

export interface Sectors {
  sectorid: number;
  sectorname: string;
  sectorcode: string;
  departments: Departments[];
}

export interface Departments{
  deptid : number
  deptname : string
  deptcode : string
  positions  : positions[] | null | ''
}

interface positions {
  id : string
  name : string
}

export interface Department {
  deptname: string;
  deptcode: string;
  position: Position[];
}

export interface Position {
  id: string;
  name: string;
  position: Position[];
}

interface EmpRole {
  id: number;
  role: string;
}

interface EmpSector {
  id: number;
  sectorName: string;
  sectorCode: string;
}

interface EmpDept {
  id: number;
  deptName: string;
  deptCode: string;
}

interface EmpPosition {
  id: number;
  positionName: string;
}

interface EmpCompany {
  id: number;
  companyName: string;
}

export interface findUserById {
  responseMessage : string;
  responseData : {
    "result" : Employee
  }
}

export interface Employee {
  id: number;
  empCode: string;
  firstname: string;
  lastname: string;
  email: string;
  status : string;
  title : string;
  roles: EmpRole[];
  sector: EmpSector;
  department: EmpDept;
  position: EmpPosition;
  company: EmpCompany;
}
export interface ViceAndApprover {
  id: number;
  empCode: string | null;
  firstname: string;
  lastname: string;
  email: string;
  status: string | null;
  roles: EmpRole[];
  sector: EmpSector;
  department: EmpDept;
  position: EmpPosition;
  company: EmpCompany;
}

interface EmpRole {
  id: number;
  role: string;
}

interface EmpSector {
  id: number;
  sectorName: string;
  sectorCode: string;
}

interface EmpDept {
  id: number;
  deptName: string;
  deptCode: string;
}

interface EmpPosition {
  id: number;
  positionName: string;
}

interface EmpCompany {
  id: number;
  companyName: string;
}

export interface Employee {
  id: number;
  empCode: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: EmpRole[];
  sectorName: EmpSector;
  departments: EmpDept[];
  position: EmpPosition;
  company: EmpCompany;
}

export interface Training {
  isDo: string;
  isDoResult: string;
  result_status: string;
  training: {
    id: number;
    dateSave: string;
    day: number;
    action: string;
    actionDate: string;
    user: {
      id: number;
      empCode: string;
      firstname: string;
      lastname: string;
      email: string;
      roles: {
        id: number;
        role: string;
      }[];
      sector: {
        id: number;
        sectorName: string;
        sectorCode: string;
      };
      department: {
        id: number;
        deptName: string;
        deptCode: string;
      };
      position: {
        id: number;
        positionName: string;
      };
      company: {
        id: number;
        companyName: string;
      };
    };
    courses: {
      id: number;
      courseName: string;
      startDate: string;
      endDate: string;
      time: string;
      note: string;
      price: number;
      priceProject: number;
      place: string;
      institute: string;
    }[];
    approve1: {
      id: number;
      empCode: string;
      firstname: string;
      lastname: string;
      email: string;
      roles: {
        id: number;
        role: string;
      }[];
      sector: {
        id: number;
        sectorName: string;
        sectorCode: string;
      };
      department: {
        id: number;
        deptName: string;
        deptCode: string;
      };
      position: {
        id: number;
        positionName: string;
      };
      company: {
        id: number;
        companyName: string;
      };
    };
    approve2: {
      id: number;
      empCode: string;
      firstname: string;
      lastname: string;
      email: string;
      roles: {
        id: number;
        role: string;
      }[];
      sector: {
        id: number;
        sectorName: string;
        sectorCode: string;
      };
      department: {
        id: number;
        deptName: string;
        deptCode: string;
      };
      position: {
        id: number;
        positionName: string;
      };
      company: {
        id: number;
        companyName: string;
      };
    };
    approve3: {
      id: number;
      empCode: string;
      firstname: string;
      lastname: string;
      email: string;
      roles: {
        id: number;
        role: string;
      }[];
      sector: {
        id: number;
        sectorName: string;
        sectorCode: string;
      };
      department: {
        id: number;
        deptName: string;
        deptCode: string;
      };
      position: {
        id: number;
        positionName: string;
      };
      company: {
        id: number;
        companyName: string;
      };
    };
    status: {
      id: number;
      status: string;
      approveId: number;
    }[];
    result: {
      id: number;
      result1: string;
      result2: string;
      result3: string;
      result4: string;
      result5: string;
      result6: string;
      result7: string;
      result: string;
      comment: string;
      cause: string;
      plan: string;
    }[];
  };
}

interface User {
  id: number;
  empCode: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: { id: number; role: string };
  sector: {
    id: number;
    sectorName: string;
    sectorCode: string;
  };
  departments: [{
    id: number;
    deptName: string;
    deptCode: string;
  }];
  position: {
    id: number;
    positionName: string;
  };
  company: {
    id: number;
    companyName: string;
  };
}

interface Coursedata {
  id: number;
  courseName: string;
  startDate: string;
  endDate: string;
  time: string;
  note: string;
  objective: string;
  price: number;
  priceProject: number;
  place: string;
  institute: string;
  type : string;
  active : string;
}

interface Approver {
  id: number;
  empCode: string | null;
  firstname: string;
  lastname: string;
  email: string;
  roles: { id: number; role: string }[];
}

interface Status {
  id: number;
  status: string | null;
  approveId: number;
}

interface Result {
  id: number;
  result1: string | null;
  result2: string | null;
  result3: string | null;
  result4: string | null;
  result5: string | null;
  result6: string | null;
  result7: string | null;
  result: string | null;
  comment: string | null;
  cause: string | null;
  plan: string | null;
}

interface Trainingdata {
  id: number;
  dateSave: string;
  day: number;
  action: string;
  actionDate: string;
  user: User;
  courses: Coursedata[];
  approve1: Approver;
  status: Status[];
  result: Result[];
  budget: number;
}

export interface ResponseDataTraining {
  result_status: string;
  training: Trainingdata;
}

export interface EditSectionOne {
  userId: number;
  dateSave: string;
  day: number;
  courseId: number;
  action: string;
  actionDate: string;
  approve1_id: number;
  approve2_id: number;
  approve3_id: number;
  approve4_id: number;
  budget: number;
  fileID : number[]
}

export interface EditSectionTwo {
  evaluationDate: string;
  result1: string | null;
  result2: string | null;
  result3: string | null;
  result4: string | null;
  result5: string | null;
  result6: string | null;
  result7: string | null;
  result: string;
  comment: string;
  cause: string;
  plan: string;
}

export interface GetUserById {
  responseMessage: string;
  responseData: {
    result: {
      id: number;
      empCode: string;
      firstname: string;
      lastname: string;
      email: string;
      roles: {
        id: number;
        role: string;
      }[];
      sector: {
        id: number;
        sectorName: string;
        sectorCode: string;
      };
      departments: [{
        id: number;
        deptName: string;
        deptCode: string;
      }];
      position: {
        id: number;
        positionName: string;
      };
      company: {
        id: number;
        companyName: string;
      };
    };
  };
}

export class SignatureResponse {
  imageUrl: string | null = null;

  constructor() {
    // ค่าเริ่มต้นสำหรับ imageUrl
    this.imageUrl = null;
  }
}

export interface GetTrainingById {
  result_status: string;
  training: {
    resultGeneric9: any;
    id: number;
    dateSave: string;
    day: number;
    budget: number;
    action: string;
    actionDate: string;
    user: {
      id: number;
      empCode: string | null;
      firstname: string;
      lastname: string;
      email: string;
      status: string;
      title: string | null;
      roles: { id: number; role: string }[];
      sector: { id: number; sectorName: string; sectorCode: string };
      department: { id: number; deptName: string; deptCode: string };
      position: { id: number; positionName: string };
      company: { id: number; companyName: string };
    };
    courses: {
      id: number;
      courseName: string;
      startDate: string;
      endDate: string;
      time: string;
      note: string;
      objective: string;
      price: number;
      priceProject: number;
      place: string;
      institute: string;
    }[];
    approve1: {
      id: number;
      empCode: string | null;
      firstname: string;
      lastname: string;
      email: string;
      status: string;
      title: string | null;
      roles: { id: number; role: string }[];
      sector: { id: number; sectorName: string; sectorCode: string };
      department: { id: number; deptName: string; deptCode: string };
      position: { id: number; positionName: string };
      company: { id: number; companyName: string };
    };
    status: {
      id: number;
      status: string;
      active: number;
      approvalDate: string;
      approveId: {
        id: number;
        empCode: string | null;
        firstname: string;
        lastname: string;
        email: string;
        status: string;
        title: string | null;
        roles: { id: number; role: string }[];
        sector: { id: number; sectorName: string; sectorCode: string };
        department: { id: number; deptName: string; deptCode: string };
        position: { id: number; positionName: string };
        company: { id: number; companyName: string };
      };
    }[];
    result: {
      id: number;
      result1: string;
      result2: string;
      result3: string;
      result4: string;
      result5: string;
      result6: string;
      result7: string;
      result: string;
      comment: string;
      cause: string;
      plan: string;
      evaluationDate: string;
    }[];
  };
}

export interface listEmp {
  company: string | null;
  empCode: string | null;
  empName: string | null;
  empPosition: string | null;
  empDept: string | null;
  courseName: string | null;
  action: string | null;
  cost: number | null;
  approver : string | null;
}

export interface budgetResponse {
  Year: string;
  Company: {
    id: number;
    companyName: string;
  };
  Department: {
    id: number;
    deptName: string;
    deptCode: string;
  };
  budgetCer: number;
  budgetTrain: number;
  budgetTotal: number;
}

export interface DeptsWithSector {
  sectorCode : string
  sectorName : string
  company : string
  department : EmpDept
}

