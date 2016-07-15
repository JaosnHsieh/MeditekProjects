package patient.telehealth.redimed.workinjury.models;

import java.util.List;

/**
 * Created by MeditekMini on 6/8/16.
 */
public class ModelPatient {

    /**
     * ID : 3
     * UID : c2af34c7-1365-4406-b087-861b74fa5f79
     * UserAccountID : 34
     * Title : Mrs
     * MaritalStatus : Never Married
     * FirstName : lam lam
     * MiddleName : ngoc
     * LastName : nguyen
     * PreferredName : null
     * PreviousName : null
     * DOB : 01/03/2016
     * Gender : Male
     * Indigenous : null
     * Occupation : Occupation123
     * Address1 : 1913 Hanoi aa
     * Address2 : ssasa
     * Postcode : 2214
     * Suburb : BAY OF SHOALSs
     * State : ACT
     * CountryID1 : 19
     * CountryID2 : null
     * Email1 : abcd@yaa.com
     * Email2 : null
     * HomePhoneNumber : 0412345
     * WorkPhoneNumber : 1234567891
     * FaxNumber : null
     * InterpreterRequired : null
     * InterperterLanguage : 90
     * OtherSpecialNeed : null
     * Enable : Y
     * Education : 1111.....
     * Signature : 3d760f24-3450-46f7-91e5-2676acd49c21
     * CreatedDate : null
     * CreatedBy : null
     * ModifiedDate : 2016-05-27T02:16:41.000Z
     * ModifiedBy : null
     * UserAccount : {"PhoneNumber":"+61412345678","Email":"abcd@yaa.com","ID":34,"UID":"ddc9e298-227c-46c0-917b-a350bf9ede6c","Enable":"Y","Activated":"Y","RelUserRoles":[{"RoleId":3},{"RoleId":6}]}
     * Companies : [{"ID":20,"UID":"45baf4ba-86ac-4493-8fbb-4158e579225b","IDRefer":null,"CompanyName":"Company1","Enable":"Y","Active":"Y","Description":"cong ty sieu da cap","CreatedDate":null,"CreatedBy":null,"ModifiedDate":"2016-04-25T02:50:15.000Z","ModifiedBy":null,"RelCompanyPatient":{"ID":15,"CompanyID":20,"PatientID":3,"Active":"Y","CreatedDate":"2016-03-03T03:55:36.000Z","CreatedBy":null,"ModifiedDate":"2016-05-16T09:45:29.000Z","ModifiedBy":null}}]
     * TeleUID : 714c45cc-6b58-4e9d-829f-8275b2891ec0
     * TeleID : 2
     * ProfileImage : null
     * CountryName : Bangladesh
     */

    private int ID;
    private String UID;
    private int UserAccountID;
    private String Title;
    private String MaritalStatus;
    private String FirstName;
    private String MiddleName;
    private String LastName;
    private Object PreferredName;
    private Object PreviousName;
    private String DOB;
    private String Gender;
    private Object Indigenous;
    private String Occupation;
    private String Address1;
    private String Address2;
    private String Postcode;
    private String Suburb;
    private String State;
    private int CountryID1;
    private Object CountryID2;
    private String Email1;
    private Object Email2;
    private String HomePhoneNumber;
    private String WorkPhoneNumber;
    private Object FaxNumber;
    private Object InterpreterRequired;
    private String InterperterLanguage;
    private Object OtherSpecialNeed;
    private String Enable;
    private String Education;
    private String Signature;
    private Object CreatedDate;
    private Object CreatedBy;
    private String ModifiedDate;
    private Object ModifiedBy;
    /**
     * PhoneNumber : +61412345678
     * Email : abcd@yaa.com
     * ID : 34
     * UID : ddc9e298-227c-46c0-917b-a350bf9ede6c
     * Enable : Y
     * Activated : Y
     * RelUserRoles : [{"RoleId":3},{"RoleId":6}]
     */

    private UserAccountBean UserAccount;
    private String TeleUID;
    private int TeleID;
    private Object ProfileImage;
    private String CountryName;
    /**
     * ID : 20
     * UID : 45baf4ba-86ac-4493-8fbb-4158e579225b
     * IDRefer : null
     * CompanyName : Company1
     * Enable : Y
     * Active : Y
     * Description : cong ty sieu da cap
     * CreatedDate : null
     * CreatedBy : null
     * ModifiedDate : 2016-04-25T02:50:15.000Z
     * ModifiedBy : null
     * RelCompanyPatient : {"ID":15,"CompanyID":20,"PatientID":3,"Active":"Y","CreatedDate":"2016-03-03T03:55:36.000Z","CreatedBy":null,"ModifiedDate":"2016-05-16T09:45:29.000Z","ModifiedBy":null}
     */

    private List<CompaniesBean> Companies;

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public int getUserAccountID() {
        return UserAccountID;
    }

    public void setUserAccountID(int UserAccountID) {
        this.UserAccountID = UserAccountID;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

    public String getMaritalStatus() {
        return MaritalStatus;
    }

    public void setMaritalStatus(String MaritalStatus) {
        this.MaritalStatus = MaritalStatus;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String FirstName) {
        this.FirstName = FirstName;
    }

    public String getMiddleName() {
        return MiddleName;
    }

    public void setMiddleName(String MiddleName) {
        this.MiddleName = MiddleName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String LastName) {
        this.LastName = LastName;
    }

    public Object getPreferredName() {
        return PreferredName;
    }

    public void setPreferredName(Object PreferredName) {
        this.PreferredName = PreferredName;
    }

    public Object getPreviousName() {
        return PreviousName;
    }

    public void setPreviousName(Object PreviousName) {
        this.PreviousName = PreviousName;
    }

    public String getDOB() {
        return DOB;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
    }

    public String getGender() {
        return Gender;
    }

    public void setGender(String Gender) {
        this.Gender = Gender;
    }

    public Object getIndigenous() {
        return Indigenous;
    }

    public void setIndigenous(Object Indigenous) {
        this.Indigenous = Indigenous;
    }

    public String getOccupation() {
        return Occupation;
    }

    public void setOccupation(String Occupation) {
        this.Occupation = Occupation;
    }

    public String getAddress1() {
        return Address1;
    }

    public void setAddress1(String Address1) {
        this.Address1 = Address1;
    }

    public String getAddress2() {
        return Address2;
    }

    public void setAddress2(String Address2) {
        this.Address2 = Address2;
    }

    public String getPostcode() {
        return Postcode;
    }

    public void setPostcode(String Postcode) {
        this.Postcode = Postcode;
    }

    public String getSuburb() {
        return Suburb;
    }

    public void setSuburb(String Suburb) {
        this.Suburb = Suburb;
    }

    public String getState() {
        return State;
    }

    public void setState(String State) {
        this.State = State;
    }

    public int getCountryID1() {
        return CountryID1;
    }

    public void setCountryID1(int CountryID1) {
        this.CountryID1 = CountryID1;
    }

    public Object getCountryID2() {
        return CountryID2;
    }

    public void setCountryID2(Object CountryID2) {
        this.CountryID2 = CountryID2;
    }

    public String getEmail1() {
        return Email1;
    }

    public void setEmail1(String Email1) {
        this.Email1 = Email1;
    }

    public Object getEmail2() {
        return Email2;
    }

    public void setEmail2(Object Email2) {
        this.Email2 = Email2;
    }

    public String getHomePhoneNumber() {
        return HomePhoneNumber;
    }

    public void setHomePhoneNumber(String HomePhoneNumber) {
        this.HomePhoneNumber = HomePhoneNumber;
    }

    public String getWorkPhoneNumber() {
        return WorkPhoneNumber;
    }

    public void setWorkPhoneNumber(String WorkPhoneNumber) {
        this.WorkPhoneNumber = WorkPhoneNumber;
    }

    public Object getFaxNumber() {
        return FaxNumber;
    }

    public void setFaxNumber(Object FaxNumber) {
        this.FaxNumber = FaxNumber;
    }

    public Object getInterpreterRequired() {
        return InterpreterRequired;
    }

    public void setInterpreterRequired(Object InterpreterRequired) {
        this.InterpreterRequired = InterpreterRequired;
    }

    public String getInterperterLanguage() {
        return InterperterLanguage;
    }

    public void setInterperterLanguage(String InterperterLanguage) {
        this.InterperterLanguage = InterperterLanguage;
    }

    public Object getOtherSpecialNeed() {
        return OtherSpecialNeed;
    }

    public void setOtherSpecialNeed(Object OtherSpecialNeed) {
        this.OtherSpecialNeed = OtherSpecialNeed;
    }

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String Enable) {
        this.Enable = Enable;
    }

    public String getEducation() {
        return Education;
    }

    public void setEducation(String Education) {
        this.Education = Education;
    }

    public String getSignature() {
        return Signature;
    }

    public void setSignature(String Signature) {
        this.Signature = Signature;
    }

    public Object getCreatedDate() {
        return CreatedDate;
    }

    public void setCreatedDate(Object CreatedDate) {
        this.CreatedDate = CreatedDate;
    }

    public Object getCreatedBy() {
        return CreatedBy;
    }

    public void setCreatedBy(Object CreatedBy) {
        this.CreatedBy = CreatedBy;
    }

    public String getModifiedDate() {
        return ModifiedDate;
    }

    public void setModifiedDate(String ModifiedDate) {
        this.ModifiedDate = ModifiedDate;
    }

    public Object getModifiedBy() {
        return ModifiedBy;
    }

    public void setModifiedBy(Object ModifiedBy) {
        this.ModifiedBy = ModifiedBy;
    }

    public UserAccountBean getUserAccount() {
        return UserAccount;
    }

    public void setUserAccount(UserAccountBean UserAccount) {
        this.UserAccount = UserAccount;
    }

    public String getTeleUID() {
        return TeleUID;
    }

    public void setTeleUID(String TeleUID) {
        this.TeleUID = TeleUID;
    }

    public int getTeleID() {
        return TeleID;
    }

    public void setTeleID(int TeleID) {
        this.TeleID = TeleID;
    }

    public Object getProfileImage() {
        return ProfileImage;
    }

    public void setProfileImage(Object ProfileImage) {
        this.ProfileImage = ProfileImage;
    }

    public String getCountryName() {
        return CountryName;
    }

    public void setCountryName(String CountryName) {
        this.CountryName = CountryName;
    }

    public List<CompaniesBean> getCompanies() {
        return Companies;
    }

    public void setCompanies(List<CompaniesBean> Companies) {
        this.Companies = Companies;
    }

    public static class UserAccountBean {
        private String PhoneNumber;
        private String Email;
        private int ID;
        private String UID;
        private String Enable;
        private String Activated;
        /**
         * RoleId : 3
         */

        private List<RelUserRolesBean> RelUserRoles;

        public String getPhoneNumber() {
            return PhoneNumber;
        }

        public void setPhoneNumber(String PhoneNumber) {
            this.PhoneNumber = PhoneNumber;
        }

        public String getEmail() {
            return Email;
        }

        public void setEmail(String Email) {
            this.Email = Email;
        }

        public int getID() {
            return ID;
        }

        public void setID(int ID) {
            this.ID = ID;
        }

        public String getUID() {
            return UID;
        }

        public void setUID(String UID) {
            this.UID = UID;
        }

        public String getEnable() {
            return Enable;
        }

        public void setEnable(String Enable) {
            this.Enable = Enable;
        }

        public String getActivated() {
            return Activated;
        }

        public void setActivated(String Activated) {
            this.Activated = Activated;
        }

        public List<RelUserRolesBean> getRelUserRoles() {
            return RelUserRoles;
        }

        public void setRelUserRoles(List<RelUserRolesBean> RelUserRoles) {
            this.RelUserRoles = RelUserRoles;
        }

        public static class RelUserRolesBean {
            private int RoleId;

            public int getRoleId() {
                return RoleId;
            }

            public void setRoleId(int RoleId) {
                this.RoleId = RoleId;
            }
        }
    }

    public static class CompaniesBean {
        private int ID;
        private String UID;
        private Object IDRefer;
        private String CompanyName;
        private String Enable;
        private String Active;
        private String Description;
        private Object CreatedDate;
        private Object CreatedBy;
        private String ModifiedDate;
        private Object ModifiedBy;
        /**
         * ID : 15
         * CompanyID : 20
         * PatientID : 3
         * Active : Y
         * CreatedDate : 2016-03-03T03:55:36.000Z
         * CreatedBy : null
         * ModifiedDate : 2016-05-16T09:45:29.000Z
         * ModifiedBy : null
         */

        private RelCompanyPatientBean RelCompanyPatient;

        public int getID() {
            return ID;
        }

        public void setID(int ID) {
            this.ID = ID;
        }

        public String getUID() {
            return UID;
        }

        public void setUID(String UID) {
            this.UID = UID;
        }

        public Object getIDRefer() {
            return IDRefer;
        }

        public void setIDRefer(Object IDRefer) {
            this.IDRefer = IDRefer;
        }

        public String getCompanyName() {
            return CompanyName;
        }

        public void setCompanyName(String CompanyName) {
            this.CompanyName = CompanyName;
        }

        public String getEnable() {
            return Enable;
        }

        public void setEnable(String Enable) {
            this.Enable = Enable;
        }

        public String getActive() {
            return Active;
        }

        public void setActive(String Active) {
            this.Active = Active;
        }

        public String getDescription() {
            return Description;
        }

        public void setDescription(String Description) {
            this.Description = Description;
        }

        public Object getCreatedDate() {
            return CreatedDate;
        }

        public void setCreatedDate(Object CreatedDate) {
            this.CreatedDate = CreatedDate;
        }

        public Object getCreatedBy() {
            return CreatedBy;
        }

        public void setCreatedBy(Object CreatedBy) {
            this.CreatedBy = CreatedBy;
        }

        public String getModifiedDate() {
            return ModifiedDate;
        }

        public void setModifiedDate(String ModifiedDate) {
            this.ModifiedDate = ModifiedDate;
        }

        public Object getModifiedBy() {
            return ModifiedBy;
        }

        public void setModifiedBy(Object ModifiedBy) {
            this.ModifiedBy = ModifiedBy;
        }

        public RelCompanyPatientBean getRelCompanyPatient() {
            return RelCompanyPatient;
        }

        public void setRelCompanyPatient(RelCompanyPatientBean RelCompanyPatient) {
            this.RelCompanyPatient = RelCompanyPatient;
        }

        public static class RelCompanyPatientBean {
            private int ID;
            private int CompanyID;
            private int PatientID;
            private String Active;
            private String CreatedDate;
            private Object CreatedBy;
            private String ModifiedDate;
            private Object ModifiedBy;

            public int getID() {
                return ID;
            }

            public void setID(int ID) {
                this.ID = ID;
            }

            public int getCompanyID() {
                return CompanyID;
            }

            public void setCompanyID(int CompanyID) {
                this.CompanyID = CompanyID;
            }

            public int getPatientID() {
                return PatientID;
            }

            public void setPatientID(int PatientID) {
                this.PatientID = PatientID;
            }

            public String getActive() {
                return Active;
            }

            public void setActive(String Active) {
                this.Active = Active;
            }

            public String getCreatedDate() {
                return CreatedDate;
            }

            public void setCreatedDate(String CreatedDate) {
                this.CreatedDate = CreatedDate;
            }

            public Object getCreatedBy() {
                return CreatedBy;
            }

            public void setCreatedBy(Object CreatedBy) {
                this.CreatedBy = CreatedBy;
            }

            public String getModifiedDate() {
                return ModifiedDate;
            }

            public void setModifiedDate(String ModifiedDate) {
                this.ModifiedDate = ModifiedDate;
            }

            public Object getModifiedBy() {
                return ModifiedBy;
            }

            public void setModifiedBy(Object ModifiedBy) {
                this.ModifiedBy = ModifiedBy;
            }
        }
    }
}
