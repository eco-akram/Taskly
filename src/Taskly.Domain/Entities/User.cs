using Taskly.Domain.Common;

namespace Taskly.Domain.Entities;

public class User : BaseEntity
{
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;

    public ICollection<Project> Projects { get; private set; } = new List<Project>();

    private User() { }

    public static User Create(string fullName, string email, string passwordHash)
        => new() { FullName = fullName, Email = email, PasswordHash = passwordHash };

    public void UpdateProfile(string fullName)
    {
        FullName = fullName;
        SetUpdatedAt();
    }
}
