module.exports = {
    AlreadyExists: (sthExist) => `${sthExist} already exists`,
    UsernamePasswordIncorrect: () => `username and/or password is incorrect`,
    Missing: (sthMissing) => `${sthMissing} is missing`,
    AlphaOnly: (fieldName) => `${fieldName} should contain alphabetic letters only`,
    NotEmail: (fieldName) => `${fieldName} should be a valid email`,
    NotOwner: (thing) => `You are not the owner of this ${thing}`
};
