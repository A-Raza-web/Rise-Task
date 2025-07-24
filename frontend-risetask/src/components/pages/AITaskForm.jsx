import { FaRobot } from 'react-icons/fa';

const AIFormPage = () => {
  return (
    <div className="container mt-5" data-aos="fade-up">
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#ff5c00',
          }}
        >
          <FaRobot style={{ color: '#fff', fontSize: '1.8rem' }} />
        </div>
        <h3 className="fw-bold" style={{ color: '#ff5c00' }}>
          AI Scheduler Assistant
        </h3>
        <p className="text-muted">Let AI plan your task with smart suggestions.</p>
      </div>

      <form className="mx-auto" style={{ maxWidth: '600px' }} data-aos="zoom-in">
        <div className="mb-3">
          <label className="form-label">Task Name</label>
          <input type="text" className="form-control" placeholder="e.g. Design UI" />
        </div>
        <div className="mb-3">
          <label className="form-label">Estimated Time (hrs)</label>
          <input type="number" className="form-control" placeholder="e.g. 4" />
        </div>
        <div className="mb-3">
          <label className="form-label">Task Details</label>
          <textarea className="form-control" rows={3} placeholder="Optional details..."></textarea>
        </div>
        <button className="btn text-white" style={{ backgroundColor: '#ff5c00' }}>
          Let AI Suggest
        </button>
      </form>
    </div>
  );
};

export default AIFormPage;
