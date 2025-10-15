export function getPublicUser(user) {

    // const {password, ...publicUser} = user;
    const publicUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        permissions: user.permissions,
        allotedFacilities: user.allotedFacilities,
    }
    
    return publicUser;
}