import { format, subDays, parseISO } from 'date-fns';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import HabitItem from './HabitItem';

const HabitList = ({ habits, toggleHabit, onEdit, onDelete }) => {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <FiCircle className="empty-icon" />
        <h3>No habits yet</h3>
        <p>Add your first habit to start tracking</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map(habit => (
        <HabitItem 
          key={habit.id} 
          habit={habit} 
          toggleHabit={toggleHabit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default HabitList;
