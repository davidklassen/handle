import uuidV4 from 'uuid/v4';
import {db} from 'handle';


export function index() {
    return db.collection('books').find();
}


export function show(req) {
    return db.collection('books').findOne(req.pathParameters.id);
}


export function create(req) {
    db.collection('books').insertOne(uuidV4(), JSON.parse(req.body));
}


export function del(req) {
    return db.collection('books').removeOne(req.pathParameters.id);
}
