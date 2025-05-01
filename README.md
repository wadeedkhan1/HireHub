# HireHub - Job Portal Platform

**HireHub** is a job portal platform that connects job seekers and recruiters. It provides an interface for job applications, and recruitment management.

---

## 🚀 Features

### For Job Seekers
- **User Dashboard**: Track applications, view job status, and manage profile  
- **Job Search**: Browse and filter job listings by various criteria  
- **Application Management**: Apply to jobs and track application status  
- **Profile Management**: Create and update professional profiles  
- **Notifications**: Receive updates on application status

### For Recruiters
- **Recruitment Dashboard**: Monitor job postings and applicant metrics  
- **Applicant Management**: Review applicants and manage the hiring process  
- **Job Posting**: Create and publish job listings  
- **Applicant Tracking**: Track applicant progress through the hiring process  

---

## 🛠 Tech Stack

### 🔷 Frontend
- **Framework**: React, TypeScript, React Router  
- **UI Components**: ShadCN UI, Lucide Icons  
- **State Management**: React Hooks  
- **API Communication**: Axios  
- **Styling**: Tailwind CSS  

### 🔶 Backend
- **Server**: Node.js, Express.js  
- **Database**: MySQL with custom triggers  
- **API Architecture**: RESTful 
---

## ⚙️ Installation

```
# Clone the repository
git clone https://github.com/wadeedkhan1/HireHub.git

# Navigate to project directory
cd HireHub

# Install dependencies for frontend
cd job-portal-frontend
npm install

# Install dependencies for backend
cd ../job-portal-backend
npm install

```
## .env Configuration
Create `.env` files in `backend` directory with appropriate environment variables.

### Running the Application
1. Navigate to the project root
2. run `npm start`
3. The application will be available at:  http://localhost:8080

---

## 📡 API Endpoints

The application uses a RESTful API with the following primary endpoints:

- **Authentication**:  
- `POST /api/auth/login`  
- `POST /api/auth/register`

- **Users**:  
- `GET /api/users/:id`  
- `GET /api/profile`

- **Jobs**:  
- `GET /api/jobs`  
- `GET /api/jobs/:id`  

- **Applications**:  
- `POST /api/applications`  
- `GET /api/applications/:id`  

- **Dashboard**:  
- `GET /api/dashboard`

---

## 🗃️ Database

Uses a **SQL database** with triggers for maintaining data integrity.  
> _Apply triggers in database initialization or migration scripts_

---

## 🔮 Future Enhancements

- Advanced search and filtering capabilities  
- Messaging system between applicants and recruiters  
- Email notifications  
- Resume parsing and job matching algorithms  
- Integration with third-party job boards  
- Mobile application  

---

## 📷 Screenshots
![image](https://github.com/user-attachments/assets/56f82817-94bf-45d6-8c95-232ceb7baad0)
![image](https://github.com/user-attachments/assets/3016875d-cc05-4971-9527-374bcd423f1d)
![image](https://github.com/user-attachments/assets/f6783bc1-285d-461c-863a-00ca77d0d6e4)





---

## 📬 Contact

**Your Name** - [wadeedkhan1@gmail.com]
**Project Link**: [https://github.com/wadeedkhan1/HireHub]
