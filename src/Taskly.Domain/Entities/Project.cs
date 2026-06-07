using Taskly.Domain.Common;

namespace Taskly.Domain.Entities;

public class Project : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public Guid OwnerId { get; private set; }

    public User Owner { get; private set; } = null!;
    public ICollection<TaskItem> Tasks { get; private set; } = new List<TaskItem>();

    private Project() { }

    public static Project Create(string name, string? description, Guid ownerId)
        => new() { Name = name, Description = description, OwnerId = ownerId };

    public void Update(string name, string? description)
    {
        Name = name;
        Description = description;
        SetUpdatedAt();
    }
}
