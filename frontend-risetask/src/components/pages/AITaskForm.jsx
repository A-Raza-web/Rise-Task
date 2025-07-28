import { FaRobot, FaTasks, FaClock, FaInfoCircle, FaMagic } from 'react-icons/fa';
import './AITaskForm.css';

const AIFormPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("AI Suggestions button clicked!");
  };

  return (
    <div className="container my-5 py-5 animated-page">
      <div className="text-center mb-5 animated-header">
        <div className="ai-icon-circle mb-3 slide-in-top">
          <FaRobot />
        </div>
        <h3 className="fw-bold display-6 slide-in-bottom" style={{ color: '#fd7e14' }}>
          AI Scheduler Assistant
        </h3>
        <p className="text-muted lead fade-in" style={{ animationDelay: '0.4s' }}>
          Let AI plan your task with smart suggestions.
        </p>
      </div>

      <form className="mx-auto ai-form-card pop-in" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 slide-in-left" style={{ animationDelay: '0.6s' }}>
            <label className="form-label ai-label">
              <FaTasks className="me-2 ai-label-icon" /> Task Name
            </label>
            <input 
              type="text" 
              className="form-control ai-input" 
              placeholder="e.g. Design UI for mobile app" 
              required 
            />
          </div>
          <div className="col-12 slide-in-right" style={{ animationDelay: '0.8s' }}>
            <label className="form-label ai-label">
              <FaClock className="me-2 ai-label-icon" /> Estimated Time (hrs)
            </label>
            <input 
              type="number" 
              className="form-control ai-input" 
              placeholder="e.g. 4" 
              min="0.5" 
              step="0.5" 
              required 
            />
          </div>
          <div className="col-12 fade-in" style={{ animationDelay: '1s' }}>
            <label className="form-label ai-label">
              <FaInfoCircle className="me-2 ai-label-icon" /> Task Details
            </label>
            <textarea 
              className="form-control ai-input" 
              rows={3} 
              placeholder="Optional details, like specific tools or dependencies..."
            ></textarea>
          </div>
        </div>
        <div className="d-grid mt-4 fade-in" style={{ animationDelay: '1.2s' }}>
          <button type="submit" className="btn text-white ai-submit-btn">
            <FaMagic className="me-2" /> Let AI Suggest
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIFormPage;