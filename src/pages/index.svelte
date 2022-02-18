<script>
  import Header from "./_components/Header.svelte";
  import { username } from "../store.js";
  import { metatags } from "@roxi/routify";
  // metatags.title = "aioaio";
  // metatags.description = "aioaio";

  import { FirebaseApp, User, Doc, Collection } from "sveltefire";

  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";

  let postText;
  // let username;
  // let loggedIn = false;

  function post(postsRef) {
    postsRef.add({
      username: $username,
      text: postText,
      createdAt: Date.now(),
    });
    postText = "";
  }

  function comment(commentsRef, postID) {
    commentsRef.add({
      username: $username,
      text: document.getElementById(postID).value,
      createdAt: Date.now(),
    });
    document.getElementById(postID).value = "";
  }
</script>

<main>
  <!-- 1. 🔥 Firebase App -->
  <FirebaseApp {firebase}>
    <Header />

    <!-- <input type="text" bind:value={username} />
    <button>Set Username</button> -->

    <Collection
      path={"posts/"}
      query={(ref) => ref.orderBy("createdAt", "desc")}
      let:data={posts}
      let:ref={postsRef}
      log
    >
      <textarea
        name="post"
        id="post"
        cols="30"
        rows="5"
        bind:value={postText}
        on:keydown={(e) => {
          if (e.key === "Enter") post(postsRef);
        }}
      />
      <button on:click={post(postsRef)}> Post </button>
      <hr />

      {#each posts as post}
        <fieldset>
          <small>{post.username}</small>
          <h3>{post.text}</h3>

          <small><em>{new Date(post.createdAt).toLocaleString()}</em></small>

          <Collection
            path={`posts/${post.id}/comments`}
            query={(ref) => ref.orderBy("createdAt")}
            let:data={comments}
            let:ref={commentsRef}
            log
          >
            {#each comments as comment}
              <small>{comment.username}</small>

              <p>{comment.text}</p>
            {/each}
            <span slot="loading">Loading comments...</span>
            <hr />

            <input
              type="text"
              id={post.id}
              on:keydown={(e) => {
                if (e.key === "Enter") {
                  comment(commentsRef, post.id);
                }
              }}
            />
            <button on:click={comment(commentsRef, post.id)}>Comment</button>
          </Collection>
        </fieldset>
      {/each}
      <span slot="loading">Loading posts...</span>
    </Collection>
    <!-- 
    <Header />

    <Collection
      path={"games/"}
      query={(ref) => ref.orderBy("createdAt")}
      let:data={games}
      let:ref={gamesRef}
      log
    >
      {#each games as game}
        <h2>{game.title}</h2>
        Game id: {game.id}

        <p>
          Game created at
          <em>{new Date(game.createdAt).toLocaleString()}</em>
        </p>

        <button
          on:click={() => {
            $goto(`/game/${game.id}`);
          }}>Go to Game</button
        >
      {/each}
      <span slot="loading">Loading games...</span>
      <hr />
      <button
        on:click={() => {
          gamesRef
            .add({
              title: "Game Title",
              createdAt: Date.now(),
              started: false,
            })
            .then((docRef) => {
              $autojoin = true;
              $goto(`/game/${docRef.id}`); // don't use "autojoin" in url because it can do weird things on reload
            });
        }}
      >
        Create Game
      </button>
    </Collection> -->
  </FirebaseApp>
</main>

<style>
  main {
    text-align: center;
  }
</style>
