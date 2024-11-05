const ProductItem = {
    props: ["product"],
    template: 
      `<div class="product mb-3">
        <img :src="product.image" :alt="product.title" class="img-fluid" />
        <div class="product-info">
          <h2>{{ product.title }}</h2>
          <p class="price">Prezzo: €{{ product.price.toFixed(2) }}</p>
        </div>
      </div>`
  }
  
  const ProductList = {
    props: ["products"],
    template: 
      `<div class="product-list">
        <ProductItem
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>`,
    components: {
      ProductItem,
    },
  }
  
  const App = {
    data() {
      return {
        products: [],
        searchTerm: "",
        selectedCategory: "",
        currentPage: 1,
        itemsPerPage: 2, // Imposta a 2 prodotti per pagina
        loading: false,
        error: null,
      }
    },
    computed: {
      filteredProducts() {
        return this.products.filter((product) => {
          const matchesSearch = product.title
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
          const matchesCategory = this.selectedCategory
            ? product.category === this.selectedCategory
            : true
          return matchesSearch && matchesCategory
        })
      },
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
      },
      paginatedProducts() {
        const start = (this.currentPage - 1) * this.itemsPerPage
        return this.filteredProducts.slice(start, start + this.itemsPerPage)
      },
    },
    methods: {
      search() {
        this.currentPage = 1
        console.log("Esegui ricerca:", this.searchTerm)
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--
        }
      },
      async fetchProducts() {
        this.loading = true
        this.error = null // Resetta l'errore
        try {
          const response = await fetch("https://fakestoreapi.com/products")
          if (!response.ok) throw new Error("Errore di rete")
  
          this.products = await response.json()
        } catch (err) {
          this.error = err.message || "Si è verificato un errore"
        } finally {
          this.loading = false // Imposta loading a false quando il caricamento è completato
        }
      },
    },
    mounted() {
      this.fetchProducts() // Richiama la funzione per ottenere i prodotti
    },
    template: 
      `<div>
        <div class="header">
          <span class="nav-link">SHOP</span>
          <span class="nav-link">ABOUT US</span>
          <span class="nav-link">CONTACT US</span>
        </div>
        <div class="container mt-5" style="margin-top: 60px;">
          <div class="search-container mb-3">
            <input type="text" v-model="searchTerm" @keyup.enter="search" class="form-control" placeholder="Cerca prodotto..." />
            <button @click="search" class="btn btn-primary mt-2">Cerca</button>
          </div>
          <select v-model="selectedCategory" class="form-select mb-3">
            <option value="">Seleziona una categoria</option>
            <option value="electronics">Elettronica</option>
            <option value="jewelery">Gioielli</option>
            <option value="men's clothing">Abbigliamento Uomo</option>
            <option value="women's clothing">Abbigliamento Donna</option>
          </select>
  
          <div v-if="loading">Caricamento in corso...</div>
          <div v-if="error">{{ error }}</div>
          <div v-if="!selectedCategory && !searchTerm && !loading && !error">Seleziona una categoria per visualizzare i prodotti.</div>
          <div v-else-if="filteredProducts.length === 0 && searchTerm">Nessun prodotto trovato per la tua ricerca.</div>
          <div v-else>
            <h2 v-if="selectedCategory">Prodotti in {{ selectedCategory }}</h2>
            <ProductList :products="paginatedProducts" />
            <div v-if="filteredProducts.length > itemsPerPage" class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">Precedente</button>
              <span>Pagina {{ currentPage }} di {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages">Successivo</button>
            </div>
          </div>
        </div>
        <div class="footer-bar"></div> <!-- Barra bianca inferiore -->
      </div>`,
    components: {
      ProductList,
    },
  }
  
  Vue.createApp(App).mount("#app")
  
  
  