export function firebaseAuthErrorCode(errorCode: string): string {
  let message = "";
  switch (errorCode) {
    case "auth/invalid-login-credentials":
      message = "Ton adresse mail ou ton mot de passe semble incorrect !";
      break;
    case "auth/user-disabled":
      message = "Mince, ton compte a été désactivé ... Contacte un admin !";
      break;
    case "auth/too-many-requests":
      message = "Trop de tentatives de connexion ! Réessaye plus tard.";
      break;
    case "auth/invalid-email":
      message = "L'adresse mail doit être dans un format valide !";
      break;
    case "auth/email-already-in-use":
      message = "Un compte existe déjà avec cette adresse mail !";
      break;
    case "auth/weak-password":
      message = "Le mot de passe doit faire au moins 6 caractères !";
      break;
    case "auth/requires-recent-login":
      message = "Tu es resté trop longtemps inactif ! Reconnecte-toi pour effectuer cette action.";
      break;
    default:
      message = "Une erreur est survenue ! Merci de réessayer plus tard.";
      break;
  }
  return message;
}
