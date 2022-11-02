export function getNote(id: string, userId: string) {
  return { id, userId, title: "title1", body: "body1" };
}

export function getNoteListItems(userId: string) {
  return [getNote("123", "123")];
}

export function createNote(body: string, title: string, userId: string) {
  return getNote("123", "123");
}

export function deleteNote(id: string, userId: string) {
  return getNote("123", "123");
}
