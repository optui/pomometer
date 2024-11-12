# Pomometer

### 1. **Data Models**

To support tasks, Pomodoros, and history tracking, you'll need a well-defined data structure. Here’s a high-level breakdown:

- **Task**: Represents a user-defined activity that has a target number of Pomodoros to complete.
  - **Fields**: `taskId`, `name`, `pomodoros`

- **Pomodoro**: Tracks each Pomodoro session.
  - **Fields**: `taskId`, `start`, `end`, `status`

- **History**: A log of completed tasks
  - **Fields**: tasks

### 2. **Core Features**

#### a. **Task Creation with Custom Pomodoros**
   - **Form**: Provide a form for users to create a new task, specifying a task name and the number of Pomodoros they want to complete for it.
   - **Flow**: Once a task is created, it’s stored in local storage and listed as an active task.
   - **UI**: Each task has a progress bar or a counter showing Pomodoros completed vs. goal.

#### b. **Timer Linked to Task**
   - **Flow**: Users start the timer, which logs Pomodoro sessions under the selected task. Once a Pomodoro is complete, it increments the `pomodorosCompleted` field in the task.
   - **Behavior**: If a task has its goal met (all Pomodoros completed), it’s marked as completed and moved to history.

#### c. **History Tracking**
   - **Flow**: Each completed Pomodoro session is logged, along with its associated task. The completed tasks and Pomodoros are stored as history data, which can be retrieved for visualizations.
   - **Storage**: Keep history in a data structure that’s easily queryable by date, such as an array of history objects, where each object represents a day and lists completed tasks and Pomodoros.

### 3. **Visualizing History on a Calendar**

For the history visualization, using a calendar view can provide insights into productivity patterns. Here’s how to approach it:

- **Calendar View**: A separate page that shows a calendar with each day indicating completed Pomodoros or tasks. Consider a color-coded heatmap where:
  - Days with more completed tasks or Pomodoros appear in darker shades.
  - Each calendar day can display a count of tasks or Pomodoros done, or even list task names briefly.

- **Data Structure**: Organize history by date, with each date containing a list of tasks completed and the number of Pomodoros done for each.

### 4. **Frontend Components to Support This Structure**

To create a modular, component-based structure that aligns with this vision, here are some suggested components:

- **Task Component**: Displays a task’s name, its Pomodoro goal, and a progress bar showing Pomodoros completed.
- **Pomodoro Timer Component**: A timer that starts, pauses, or resets for the active task.
- **History Component**: Shows a log of completed tasks and Pomodoros for a given day or week.
- **Calendar Component**: Displays history in a calendar format with color-coded days for quick visual feedback on productivity.

### 5. **Sample Flow for Users**

1. **Create a Task**: User opens the app, creates a task with a name and a custom number of Pomodoros.
2. **Start Pomodoro Session**: The user starts the timer on the task. Each completed Pomodoro increments the task’s progress.
3. **Complete Task**: Once all Pomodoros are done, the task is moved to history.
4. **Review Progress**: User visits the calendar view to see a visual summary of tasks and Pomodoros completed over time.

### 6. **Long-term Considerations**

- **Future Storage**: For local storage, ensure you have a structure that can be easily adapted to a database if you decide to expand.
- **Data Aggregation for Calendar View**: Consider how you will aggregate Pomodoros per day for visualization. A good practice is to store them as completed dates with timestamps.
- **Performance Optimization**: As history grows, optimize retrieval from storage, especially for calendar views.

This structure aligns with your vision and provides a clear roadmap for implementing a component-based, goal-oriented Pomodoro app. Let me know if you’d like more details on any specific part!