import { Navigate } from "react-router-dom";

const ADMIN_ROLES = ["admin", "superadmin"];
const VOLUNTEER_ROLE = "volunteer";
const STAFF_ROLE = "staff";

function RoleRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!role || !allowedRoles.includes(role)) {
        if (role === VOLUNTEER_ROLE || role === STAFF_ROLE) {
            return <Navigate to="/verify" replace />;
        }
        if (role === "superadmin") {
            return <Navigate to="/manage-admins" replace />;
        }
        if (role === "admin") {
            return <Navigate to="/admin-dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
}

export function AdminOnlyRoute({ children }) {
    return <RoleRoute allowedRoles={ADMIN_ROLES}>{children}</RoleRoute>;
}

/** Event create, volunteer register — admin role only (not superadmin) */
export function RegularAdminOnlyRoute({ children }) {
    return <RoleRoute allowedRoles={["admin"]}>{children}</RoleRoute>;
}

export function SuperAdminOnlyRoute({ children }) {
    return <RoleRoute allowedRoles={["superadmin"]}>{children}</RoleRoute>;
}

export function VolunteerOnlyRoute({ children }) {
    return <RoleRoute allowedRoles={[VOLUNTEER_ROLE]}>{children}</RoleRoute>;
}

export function StaffRoute({ children }) {
    return <RoleRoute allowedRoles={[...ADMIN_ROLES, VOLUNTEER_ROLE, STAFF_ROLE]}>{children}</RoleRoute>;
}

export default RoleRoute;
