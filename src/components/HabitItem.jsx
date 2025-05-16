import { useState } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { FiCheckCircle, FiCircle, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const HabitItem = ({ habit, toggleHabit, onEdit, onDelete }) => {
  const [showHistory, setShowHistory] = useState(false);

  // Generate last 7 days for the streak display
  const generateLastSevenDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find if there's a history entry for this date
      const historyEntry = habit.history.find(h => h.date === dateStr);
      
      days.push({
        date: dateStr,
        formattedDate: format(date, 'E'), // Day of week abbreviated
        completed: historyEntry ? historyEntry.completed : false
      });
    }
    
    return days;
  };

  const lastSevenDays = generateLastSevenDays();

  // Calculate the number of completed days in the last 7 days
  const completedDays = lastSevenDays.filter(day => day.completed).length;

  return (
    <div className="habit-item">
      <div className="habit-main">
        <button 
          className="habit-check" 
          onClick={() => toggleHabit(habit.id)}
          aria-label={habit.completedToday ? "Mark as incomplete" : "Mark as complete"}
        >
          {habit.completedToday ? (
            <FiCheckCircle className="check-icon completed" />
          ) : (
            <FiCircle className="check-icon" />
          )}
        </button>
        <div className="habit-content">
          <div className="habit-header">
            <h3 className="habit-name">{habit.name}</h3>
            <div className="habit-actions">
              <button 
                className="action-btn edit-btn" 
                onClick={() => onEdit(habit)}
                aria-label="Edit habit"
              >
                <FiEdit2 />
              </button>
              <button 
                className="action-btn delete-btn" 
                onClick={() => onDelete(habit.id)}
                aria-label="Delete habit"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
          
          <div className="habit-summary">
            <div className="streak-summary">
              <span>{completedDays}/7 days</span>
            </div>
            <button 
              className="toggle-history-btn"
              onClick={() => setShowHistory(!showHistory)}
              aria-label={showHistory ? "Hide history" : "Show history"}
            >
              {showHistory ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {showHistory && (
            <div className="habit-streak">
              {lastSevenDays.map((day, index) => (
                <div key={index} className="streak-day">
                  <div className={`streak-indicator ${day.completed ? 'completed' : ''}`}></div>
                  <span className="streak-label">{day.formattedDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitItem;
