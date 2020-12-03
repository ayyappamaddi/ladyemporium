import { Subject } from 'rxjs';

const subject = new Subject();

export default {
    sendMessage: (event, data) => subject.next({event, data }),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable()
};