from rest_framework.permissions import SAFE_METHODS, BasePermission


class RoleBasedPermission(BasePermission):
    """Centralized DRF permission class evaluating user roles against view requirements."""

    allowed_roles = []

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or getattr(request.user, "role", None) == "ADMIN":
            return True
        return getattr(request.user, "role", None) in getattr(view, "required_roles", self.allowed_roles)


class IsScientificResearcherOrReadOnly(RoleBasedPermission):
    allowed_roles = ["RESEARCHER", "ADMIN"]


class IsAdminUserOnly(RoleBasedPermission):
    allowed_roles = ["ADMIN"]
