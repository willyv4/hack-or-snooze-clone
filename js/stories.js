"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
// ready code to understand try implementing in another way
function getStarHTML(story, user) {
  const isFavorite = user.getFavorites(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

async function addNewStory(e) {
  console.debug("addNewStory");
  e.preventDefault();

  let inputAuth = $("#author-input").val();
  let inputTitle = $("#title-input").val();
  let inputURL = $("#url-input").val();

  const newStory = await storyList.addStory(currentUser, {
    title: inputTitle,
    author: inputAuth,
    url: inputURL,
  });

  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  console.log(newStory);

  $submitStory.hide();
  $submitStory.trigger("reset");
}

$submitStory.on("submit", addNewStory);

function addFavsUI() {
  $favsList.empty();
  if (currentUser.favorites.length === 0) {
    $favsList.append("<h4>No Favorites added</h4>");
  } else {
    for (const story of currentUser.favorites) {
      const $storyMarkup = generateStoryMarkup(story);
      $favsList.append($storyMarkup);
    }
  }
}

function addUserStories() {
  $myStories.empty();
  if (currentUser.ownStories.length === 0) {
    $myStories.append("<h4>No Favorites added</h4>");
  } else {
    for (const story of currentUser.ownStories) {
      const $storyMarkup = generateStoryMarkup(story);
      $myStories.append($storyMarkup);
    }
  }
}

async function controlFav(event) {
  console.debug("controlFav");
  let $target = $(event.target);

  const storyId = $target.parent().parent().attr("id");
  const story = storyList.stories.find((story) => story.storyId === storyId);

  $target.hasClass("fas")
    ? (await currentUser.updateFavorites("delete", story)) &&
      $target.closest("i").toggleClass("fas far")
    : (await currentUser.updateFavorites("add", story)) &&
      $target.closest("i").toggleClass("fas far");
}

$storiesLists.on("click", ".star", controlFav);
