import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // ===== TYPES =====
  type AssistanceStatus = {
    #pending;
    #underReview;
    #approved;
    #rejected;
  };

  type User = {
    id : Principal;
    fullName : Text;
    email : Text;
    password : Text;
    phoneNumber : Text;
    countryCode : Text;
    countryName : Text;
    deviceType : Text;
    browser : Text;
    os : Text;
    ipAddress : Text;
    registrationDate : Time.Time;
  };

  type AssistanceRequest = {
    id : Nat;
    userEmail : Text;
    fullName : Text;
    country : Text;
    reason : Text;
    description : Text;
    amountRequested : Text;
    paymentMethod : Text;
    accountDetails : Text;
    status : AssistanceStatus;
    submissionDate : Time.Time;
  };

  public type UserProfile = {
    fullName : Text;
    email : Text;
    phoneNumber : Text;
    countryCode : Text;
    countryName : Text;
  };

  // ===== STATE =====
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let users = Map.empty<Text, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let assistanceRequests = Map.empty<Nat, AssistanceRequest>();
  var nextRequestId = 0;

  // ===== UTILS =====
  func isAdmin(email : Text, password : Text) : Bool {
    Text.equal(email, "adebayoaminahanike@gmail.com") and Text.equal(password, "Anike4402");
  };

  // ===== REQUIRED PROFILE FUNCTIONS =====

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ===== MAIN FUNCTIONS =====

  // 1. User Registration - accessible to all (guests)
  public shared ({ caller }) func registerUser(
    fullName : Text,
    email : Text,
    password : Text,
    phoneNumber : Text,
    countryCode : Text,
    countryName : Text,
    deviceType : Text,
    browser : Text,
    os : Text,
    ipAddress : Text
  ) : async () {
    if (users.containsKey(email)) {
      Runtime.trap("Email already registered");
    };

    let user : User = {
      id = caller;
      fullName;
      email;
      password;
      phoneNumber;
      countryCode;
      countryName;
      deviceType;
      browser;
      os;
      ipAddress;
      registrationDate = Time.now();
    };

    users.add(email, user);

    // Also save as user profile for the caller
    let profile : UserProfile = {
      fullName;
      email;
      phoneNumber;
      countryCode;
      countryName;
    };
    userProfiles.add(caller, profile);
  };

  // 2. User Login - accessible to all (guests)
  public query ({ caller }) func loginUser(email : Text, password : Text) : async Bool {
    switch (users.get(email)) {
      case (?user) {
        Text.equal(user.password, password);
      };
      case (null) { false };
    };
  };

  // 3. Submit Assistance Request - NO role/permission check required per spec
  public shared ({ caller }) func submitAssistanceRequest(
    userEmail : Text,
    fullName : Text,
    country : Text,
    reason : Text,
    description : Text,
    amountRequested : Text,
    paymentMethod : Text,
    accountDetails : Text
  ) : async () {
    let request : AssistanceRequest = {
      id = nextRequestId;
      userEmail;
      fullName;
      country;
      reason;
      description;
      amountRequested;
      paymentMethod;
      accountDetails;
      status = #pending;
      submissionDate = Time.now();
    };

    assistanceRequests.add(nextRequestId, request);
    nextRequestId += 1;
  };

  // 4. Get Requests by Email - uses email/password verification (application-level auth)
  public query ({ caller }) func getUserRequestsByEmail(email : Text, password : Text) : async [AssistanceRequest] {
    switch (users.get(email)) {
      case (?user) {
        if (Text.equal(user.password, password)) {
          assistanceRequests.values().toArray().filter(
            func(request) { Text.equal(request.userEmail, email) }
          );
        } else {
          Runtime.trap("Incorrect password");
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // 5. Admin Login - accessible to all (guests)
  public query ({ caller }) func adminLogin(email : Text, password : Text) : async Bool {
    isAdmin(email, password);
  };

  // 6. Admin Get All Users - uses email/password admin verification
  public query ({ caller }) func adminGetAllUsers(email : Text, password : Text) : async [User] {
    if (not isAdmin(email, password)) {
      Runtime.trap("Unauthorized: Invalid admin credentials");
    };
    users.values().toArray();
  };

  // 7. Admin Get All Requests - uses email/password admin verification
  public query ({ caller }) func adminGetAllRequests(email : Text, password : Text) : async [AssistanceRequest] {
    if (not isAdmin(email, password)) {
      Runtime.trap("Unauthorized: Invalid admin credentials");
    };
    assistanceRequests.values().toArray();
  };

  // 8. Admin Get Total User Count - uses email/password admin verification
  public query ({ caller }) func adminGetTotalUserCount(email : Text, password : Text) : async Nat {
    if (not isAdmin(email, password)) {
      Runtime.trap("Unauthorized: Invalid admin credentials");
    };
    users.size();
  };

  // 9. Admin Update Request Status - uses email/password admin verification
  public shared ({ caller }) func adminUpdateRequestStatus(
    email : Text,
    password : Text,
    requestId : Nat,
    status : AssistanceStatus
  ) : async () {
    if (not isAdmin(email, password)) {
      Runtime.trap("Unauthorized: Invalid admin credentials");
    };

    switch (assistanceRequests.get(requestId)) {
      case (?request) {
        let updatedRequest : AssistanceRequest = {
          id = request.id;
          userEmail = request.userEmail;
          fullName = request.fullName;
          country = request.country;
          reason = request.reason;
          description = request.description;
          amountRequested = request.amountRequested;
          paymentMethod = request.paymentMethod;
          accountDetails = request.accountDetails;
          status;
          submissionDate = request.submissionDate;
        };
        assistanceRequests.add(requestId, updatedRequest);
      };
      case (null) { Runtime.trap("Request not found") };
    };
  };
};
