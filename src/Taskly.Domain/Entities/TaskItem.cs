using Taskly.Domain.Common;
using Taskly.Domain.Enums;

namespace Taskly.Domain.Entities;

public class TaskItem : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public TaskStatus Status { get; private set; } = TaskStatus.Todo;
    public TaskPriority Priority { get; private set; } = TaskPriority.Medium;
    public DateTime? DueDate { get; private set; }
    public Guid ProjectId { get; private set; }
    public Guid? AssigneeId { get; private set; }

    public Project Project { get; private set; } = null!;
    public User? Assignee { get; private set; }

    private TaskItem() { }

    public static TaskItem Create(string title, string? description, TaskPriority priority, DateTime? dueDate, Guid projectId, Guid? assigneeId = null)
        => new() { Title = title, Description = description, Priority = priority, DueDate = dueDate, ProjectId = projectId, AssigneeId = assigneeId };

    public void Update(string title, string? description, TaskPriority priority, DateTime? dueDate, Guid? assigneeId)
    {
        Title = title;
        Description = description;
        Priority = priority;
        DueDate = dueDate;
        AssigneeId = assigneeId;
        SetUpdatedAt();
    }

    public void ChangeStatus(TaskStatus status)
    {
        Status = status;
        SetUpdatedAt();
    }
}
