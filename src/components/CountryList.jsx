import styles from "./CountryList.module.css"
import Message from "./Message"
import Spinner from "./Spinner"
import CountryItem from "./CountryItem"

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />

  if (cities.length === 0)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    )

  const countries = cities.reduce((acc, city) => {
    if (!acc.map((el) => el.country).includes(city.country)) {
      return [...acc, { country: city.country, emoji: city.emoji }]
    }
    return acc
  }, [])
  console.log(countries)
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  )
}

export default CountryList
