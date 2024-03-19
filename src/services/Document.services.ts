import { ADD_DOCUMENT_NOTE, GET_LIST_DOCUMENT, GET_LIST_DOCUMENT_NOTE } from "../const/api";
import { IAddDocumentNote, IRequestGetListDocument, IRequestGetListDocumentNote } from "../interface/document";
import httpServices from "./httpServices";
import queryString from "query-string";

class DocumentServices {
  getListDocument(body: IRequestGetListDocument) {
    return httpServices.get(`${GET_LIST_DOCUMENT}?${queryString.stringify(body)}`);
  };

  getListDocumentNote(body: IRequestGetListDocumentNote) {
    return httpServices.get(`${GET_LIST_DOCUMENT_NOTE}?${queryString.stringify(body)}`);
  };

  addDocumentNote(body: IAddDocumentNote) {
    return httpServices.post(`${ADD_DOCUMENT_NOTE}`, body);
  }
  
}

export default new DocumentServices()