const mongoose = require('mongoose');                              // מטעין את Mongoose לעבודה מול MongoDB

const deviceRequestSchema = new mongoose.Schema({                  // מגדיר סכימה (מבנה מסמך) לבקשות מכשיר
  name:   { type: String, required: true, trim: true },            // שם המכשיר המבוקש (חובה), מנקה רווחים בקצוות
  type:   { type: String, required: true, trim: true },            // סוג/קטגוריה של המכשיר (חובה)
  roomId: {                                                        // החדר שאליו משייכים את המכשיר
    type: mongoose.Schema.Types.ObjectId,                          // מזהה אובייקט של מונגו
    ref: 'Room',                                                   // מפנה לאוסף Rooms (ל- populate)
    required: true                                                 // שדה חובה
  },

  requestedBy: {                                                   // מי המשתמש שביקש את המכשיר
    type: mongoose.Schema.Types.ObjectId,                          // מזהה משתמש
    ref: 'User',                                                   // מפנה לאוסף Users
    required: true                                                 // חובה
  },
  requestedByName: { type: String, required: true },               // שם המשתמש לבירור/תצוגה מהירה (נוח ב-UI)

  status: {                                                        // מצב הטיפול בבקשה
    type: String,                                                  // טיפוס מחרוזת
    enum: ['pending','approved','rejected'],                       // הערכים המותרים
    default: 'pending',                                            // מתחיל כ"ממתין"
    required: true                                                 // חובה
  },

  reviewedBy: {                                                    // מי האדמין שטיפל (אישר/דחה)
    type: mongoose.Schema.Types.ObjectId,                          // מזהה משתמש
    ref: 'User'                                                    // הפניה לאוסף Users
  }
}, { timestamps: true });                                          // יוצר createdAt ו- updatedAt אוטומטית

module.exports = mongoose.model('DeviceRequest', deviceRequestSchema); // מייצא את המודל לשימוש בשאר הקוד
