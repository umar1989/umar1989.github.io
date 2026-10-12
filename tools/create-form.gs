/* Creates the "visitor / reviewer contact" Google Form in YOUR Google account.
   How to use:
   1. Open https://script.google.com -> New project, paste this whole file, save.
   2. Optionally fill CALENDAR_URL below (Google Calendar -> Appointment schedule -> share link).
   3. Choose the function createForm in the toolbar and press Run (approve the permissions once).
   4. View -> Logs (or Execution log) prints the form link. Copy the "send to people" link into
      data.js -> profile.availability.form (see README), then run: npm run build && ./publish.sh
   Responses land in the form's Responses tab; you also get an e-mail for each new submission. */

var CALENDAR_URL = "";                 // optional: your Google Calendar appointment-page link
var NOTIFY_EMAIL = "inbox@umarmukthar.in";

var TITLE = "Contact A. Umarmukthar - Physics Teacher";
var STATUS = "Presently working";
var NOTICE = "60-90 days";

function createForm() {
  var form = FormApp.create(TITLE);
  var desc = "Thank you for reviewing my profile (umarmukthar.in). Please leave your details and I will get back to you.\n\n" +
    "My job status: " + STATUS + "\nNotice period: " + NOTICE;
  if (CALENDAR_URL) desc += "\nMy availability calendar: " + CALENDAR_URL;
  form.setDescription(desc)
      .setCollectEmail(false)
      .setAllowResponseEdits(false)
      .setConfirmationMessage("Thank you. I will contact you soon.");

  form.addTextItem().setTitle("Your name").setRequired(true);
  form.addTextItem().setTitle("School / organisation").setRequired(true);
  form.addTextItem().setTitle("Your designation (e.g. Principal, HR, Director)").setRequired(false);

  var email = form.addTextItem().setTitle("Email").setRequired(true);
  email.setValidation(FormApp.createTextValidation().setHelpText("Enter a valid email address.").requireTextIsEmail().build());

  form.addTextItem().setTitle("Phone / WhatsApp number").setHelpText("Optional. Include country code.").setRequired(false);

  form.addCheckboxItem().setTitle("Position you are considering me for")
      .setChoiceValues(["TGT Physics", "PGT Physics", "IIT/NEET Foundation Teacher", "Academic Coordinator", "Vice Principal / Head", "Other"])
      .setRequired(true);

  form.addMultipleChoiceItem().setTitle("Expected joining time")
      .setChoiceValues(["Immediately", "Within 1 month", "Within 2-3 months", "Next academic year", "Not decided"])
      .setRequired(false);

  form.addMultipleChoiceItem().setTitle("Best way to contact you")
      .setChoiceValues(["Email", "Phone call", "WhatsApp"])
      .setRequired(true);

  form.addParagraphTextItem().setTitle("Message / requirement").setHelpText("Location, salary range, subjects, anything you would like me to know.").setRequired(false);

  // E-mail me on every submission.
  ScriptApp.newTrigger("notifyOnSubmit").forForm(form).onFormSubmit().create();

  Logger.log("Edit the form:  " + form.getEditUrl());
  Logger.log("Send to people: " + form.getPublishedUrl());
}

function notifyOnSubmit(e) {
  var lines = e.response.getItemResponses().map(function (r) {
    return r.getItem().getTitle() + ": " + r.getResponse();
  });
  MailApp.sendEmail(NOTIFY_EMAIL, "New contact from your website", lines.join("\n"));
}
