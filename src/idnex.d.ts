import firebase from "firebase"

export type Subject = "eng" | "hin" | "sci" | "mat" | "ssc"

type FBDate = firebase.firestore.Timestamp

export type CalendarEvent = {
  date: FBDate,
  description: string,
  name: string,
  type: "test" | "holiday"
} | {
  startDate: FBDate,
  endDate: FBDate,
  description: string,
  name: string,
  type: "vacation"
}