import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Wiki from './pages/Wiki'
import ProjectDetail from './pages/ProjectDetail'
import Insights from './pages/Insights'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Demos from './pages/Demos'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="wiki" element={<Wiki />} />
        <Route path="wiki/:slug" element={<ProjectDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="demos" element={<Demos />} />
        <Route path="insights" element={<Insights />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}
