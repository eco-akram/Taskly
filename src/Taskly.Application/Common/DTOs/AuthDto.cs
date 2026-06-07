namespace Taskly.Application.Common.DTOs;

public record AuthResponseDto(string Token, string FullName, string Email);
public record ProjectDto(Guid Id, string Name, string? Description, DateTime CreatedAt, int TaskCount);
public record TaskDto(Guid Id, string Title, string? Description, string Status, string Priority, DateTime? DueDate, Guid ProjectId, Guid? AssigneeId, DateTime CreatedAt);
