import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {loginRequest, registerRequest, logoutRequest} from '../Api/authAPI'
import axios from 'axios';
import {getBuyer, getCartsByBuyerId} from '../Api/buyerAPI';
import {getSeller, getShopByAccountId} from '../Api/sellerAPI';
import {jwtDecode} from 'jwt-decode';



// const api = 'http://localhost:8080';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    register: (email: string, password: string, role: string) => Promise<any>;
    token: string | null;
    user : any;
    loading: boolean;
    error: string;
    buyerId?: string | null;
    sellerId?: string | null;
    shopId?: string | null;
    cartCount?: number;

};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [buyerId, setBuyerId] = useState<string | null>(null);
    const [sellerId, setSellerId] = useState<string | null>(null);
    const [shopId, setShopId] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState<number>(0);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token")
                const user = localStorage.getItem("user")
                const buyerId = localStorage.getItem("buyerId");
                const sellerId = localStorage.getItem("sellerId");
                const shopId = localStorage.getItem("shopId");
                const cartCount = localStorage.getItem("cartCount");
                setBuyerId(buyerId);
                setSellerId(sellerId);
                setShopId(shopId);
                setCartCount(cartCount ? parseInt(cartCount) : 0);
                const decodedToken = token ? jwtDecode(token) as { exp: number } : null;
                const currentTime = Date.now() / 1000; 
                if (decodedToken && decodedToken.exp < currentTime) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("buyerId");
                    localStorage.removeItem("sellerId");
                    localStorage.removeItem("shopId");
                    localStorage.removeItem("cartCount");
                    

                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }
                if (token) {
                    setIsAuthenticated(true);
                    setUser(JSON.parse(user || '{}'));
                    setError('');
                    setLoading(false);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error checking session: " + error);
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };
        checkSession();
    }, []);

  const login = async (email: string, password: string):Promise<void> => {
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      if (!data || !data.accessToken) {
        setError('Login failed');
        return;
      }
      const token = data.accessToken;
      setToken(token);
      localStorage.setItem('token', token);

      const userData = data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setError('');
      if (userData.role === 'buyer') {
        const buyer = await getBuyer(userData.id);
        localStorage.setItem('buyerId', buyer.id);
        setBuyerId(buyer.id);

        const carts = await getCartsByBuyerId(buyer.id);
        localStorage.setItem('cartCount', carts.carts.length.toString());
        setCartCount(carts.carts.length);

      }
      if (userData.role === 'seller') {
        const seller = await getSeller(userData.id);
        localStorage.setItem('sellerId', seller.id);
        setSellerId(seller.id);
        const shop = await getShopByAccountId(userData.id);
        localStorage.setItem('shopId', shop.id);
        setShopId(shop.id);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        
        console.log('Error response:', error.response?.data);
        setError(error.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };


  const register = async (email: string, password: string, role: string):Promise<any> => {
    setLoading(true);
    try {
      const response = await registerRequest(email, password, role);

      if (!response) {
        setError('Sign up failed');
        return;
      }

      setError('');
      setUser(response.newUser);
      return response;

    } catch (error) {
      console.error('Sign up error', error);
    } finally {
      setLoading(false);
    }
  }



  const logout = async () => {
    try{
      await logoutRequest();
    } catch (error) {
      console.error('Logout error', error);
    }
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setError('');
  };

  return (
    <AuthContext.Provider value={{ login, logout, register, user, isAuthenticated, token, error: error , loading, buyerId, sellerId, shopId, cartCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
