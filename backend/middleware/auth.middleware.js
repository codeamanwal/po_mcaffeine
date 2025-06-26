export async function AuthMiddleware (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = verifyToken(token);
        req.user = decodedToken.user;
        next();
    } catch (error) {
        return res.json({
            msg: "Authentication failed",
            success: false,
            status: 401
        },status=401);
    }
}

export async function SuperAdminMiddleware (req, res, next) {
    try {
        const user = req.user;
        if(user.role === "superadmin") {
            next();
        } else {
            return res.json({
                msg: "You are not authorized for this action",
                success: false,
                status: 401
            });
        }
    } catch (error) {
        return res.json({
            msg: "Authentication failed",
            success: false,
            status: 401
        });
    }
}

export async function AdminMiddleware (req, res, next) {
    try {
        const user = req.user;
        if(user.role === "admin" || user.role === "superadmin") {
            next();
        } else {
            return res.json({
                msg: "You are not authorized for this action",
                success: false,
                status: 401
            });
        }
    } catch (error) {
        return res.json({
            msg: "Authentication failed",
            success: false,
            status: 401
        });
    }
}

export async function WarehouseMiddleware (req, res, next) {
    try {
        const user = req.user;
        if(user.role === "warehouse") {
            next();
        } else {
            return res.json({
                msg: "You are not authorized for this action",
                success: false,
                status: 401
            });
        }
    } catch (error) {
        return res.json({
            msg: "Authentication failed",
            success: false,
            status: 401
        });
    }
}

export async function LogisticMiddleware (req, res, next) {
    try {
        const user = req.user;
        if(user.role === "logistic") {
            next();
        } else {
            return res.json({
                msg: "You are not authorized for this action",
                success: false,
                status: 401
            });
        }
    } catch (error) {
        return res.json({
            msg: "Authentication failed",
            success: false,
            status: 401
        });
    }
}