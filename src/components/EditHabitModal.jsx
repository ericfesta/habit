import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const EditHabitModal = ({ habit, onClose, onEditHabit }) => {
  const [habitName, setHabitName] = useState(habit.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onEditHabit(habit.id, habitName.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit Habit</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="habit-name" className="form-label">Habit Name</label>
            <input
              type="text"
              id="habit-name"
              className="form-input"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!habitName.trim() || habitName === habit.name}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHabitModal;
