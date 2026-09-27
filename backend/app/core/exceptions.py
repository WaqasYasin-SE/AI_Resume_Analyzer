class AppException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = 400,
    ) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class AuthenticationError(AppException):
    def __init__(
        self,
        message: str = "Authentication failed.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=401,
        )


class AuthorizationError(AppException):
    def __init__(
        self,
        message: str = "You are not authorized to perform this action.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=403,
        )


class ValidationAppError(AppException):
    def __init__(
        self,
        message: str = "Invalid request.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=422,
        )


class ResourceNotFoundError(AppException):
    def __init__(
        self,
        message: str = "Resource not found.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=404,
        )


class InternalServerError(AppException):
    def __init__(
        self,
        message: str = "Internal server error.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=500,
        )


class AIServiceError(AppException):
    def __init__(
        self,
        message: str = "AI service is currently unavailable.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=503,
        )