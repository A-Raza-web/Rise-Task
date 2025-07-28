// src/components/Pages/TeamTasksPage.jsx
import { FaUsers,FaClipboardList, FaPlus } from 'react-icons/fa';
import './TeamTasksPage.css';

const TeamTasksPage = () => {
  return (
    <div className="team-tasks-page">
      <div className="container py-5">
        <div className="text-center mb-5 fade-in"> 
          <div className="icon-circle mb-3" style={{ backgroundColor: '#fd7e14' }}>
            <FaUsers />
          </div>
          <h1 className="display-4 fw-bold" style={{ color: '#fd7e14' }}>Team Tasks</h1>
          <p className="lead text-muted">Collaborate with your team in real time with shared workspaces.</p>
        </div>

        <div className="row g-4">
          {/* Card 1: View all tasks */}
          <div className="col-md-4" style={{ animationDelay: '0.2s' }}>
            <div className="card h-100 shadow-sm border-0 pop-in">
              <div className="card-body text-center p-4">
                <div className="icon-box mb-3" style={{ color: '#fd7e14' }}>
                  <FaClipboardList />
                </div>
                <h5 className="card-title fw-bold">View All Tasks</h5>
               <p className="card-text text-muted">
                 See team tasks and progress instantly.
               </p>
                <button className="btn btn-orange-outline mt-3">
                  Go to Dashboard <FaClipboardList className="ms-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Create a new task */}
          <div className="col-md-4" style={{ animationDelay: '0.4s' }}>
            <div className="card h-100 shadow-sm border-0 pop-in"> 
              <div className="card-body text-center p-4">
                <div className="icon-box mb-3" style={{ color: '#fd7e14' }}>
                  <FaPlus />
                </div>
                <h5 className="card-title fw-bold">Create a New Task</h5>
                <p className="card-text text-muted">
                  Assign a new task to your team members.
                </p>
                <button className="btn btn-orange mt-3">
                  Create Task <FaPlus className="ms-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Team Members */}
          <div className="col-md-4" style={{ animationDelay: '0.6s' }}>
            <div className="card h-100 shadow-sm border-0 pop-in"> 
              <div className="card-body text-center p-4">
                <div className="icon-box mb-3" style={{ color: '#fd7e14' }}>
                  <FaUsers />
                </div>
                <h5 className="card-title fw-bold">Manage Team</h5>
                <p className="card-text text-muted">
                  Add or remove members and set permissions.
                </p>
                <button className="btn btn-orange-outline mt-3">
                  Manage Team <FaUsers className="ms-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamTasksPage;