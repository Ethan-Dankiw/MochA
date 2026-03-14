interface ResponseSuccess<T> {
    success: true;
    data: T;
}


interface ResponseFailure {
    success: false;
    error: string;
}

type ServerResponse<T> = ResponseSuccess<T> | ResponseFailure;