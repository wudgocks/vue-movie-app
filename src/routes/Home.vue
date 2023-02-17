<template>
  <HeadLine />
  <Search />
  <MovieList />
</template>

<script>
import HeadLine from '~/components/HeadLine'
import Search from '~/components/Search'
import MovieList from '~/components/MovieList'

export default {
  components: {
    HeadLine,
    Search,
    MovieList
  },
  created() {
    this.$store.commit('movie/resetMovies')
  }
}
</script>