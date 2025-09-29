export const TYPES = {
    DoctorService: Symbol.for('DoctorService'),
    DoctorController: Symbol.for('DoctorController'),
    DoctorRepository: Symbol.for('DoctorRepository'),

    UserController: Symbol.for('UserController'),
    UserService: Symbol.for('UserService'),
    UserRepository: Symbol.for('UserRepository'),

    AuthController: Symbol.for('AuthController'),
    AuthService: Symbol.for('AuthService'),
    AuthRepository: Symbol.for('AuthRepository'),

    RegistrationController: Symbol.for('RegistrationController'),
    RegisterService: Symbol.for('RegisterService'),
    RegistrationRepository: Symbol.for('RegistrationRepository'),

    DoctorPaymentRepository: Symbol.for('DoctorPaymentRepository'),
    DoctorPaymentService: Symbol.for('DoctorPaymentService'),
    DoctorPaymentController: Symbol.for('DoctorPaymentController'),

    UserBlockRepository: Symbol.for('UserBlockRepository'),
    UserBlockAndUnblockService: Symbol.for('UserBlockAndUnblockService'),
    UserBlockAndUnblockController: Symbol.for('UserBlockAndUnblockController'),
};
