"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $favsList.hide();
  $submitStory.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitNewStory() {
  console.debug("submitNewStory");
  $submitStory.show();
  $favsList.hide();
  $myStories.hide();
  putStoriesOnPage();
}

$addStory.on("click", submitNewStory);

function seeFavorites() {
  hidePageComponents();
  addFavsUI();
  $submitStory.hide();
  $favsList.show();
  $myStories.hide();
}
$addFavs.on("click", seeFavorites);

function seeUserAdded() {
  hidePageComponents();
  addUserStories();
  $submitStory.hide();
  $myStories.show();
  $favsList.hide();
}

$userStory.on("click", seeUserAdded);
