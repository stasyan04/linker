import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronRight,
  Link as LinkIcon,
  LogIn,
  UserPlus,
  ExternalLink,
  List,
  Link2,
} from "lucide-react";
import {
  GlobalStyle,
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  LinkButton,
  FormGroup,
  Label,
  Input,
  Form,
  UrlCard,
  UrlCardContent,
  UrlText,
  ExternalLinkStyled,
  Header,
  Section,
  UrlList as StyledUrlList,
  ErrorText,
  ChartWrapper,
  LoadingSpinner,
} from "./styles";

export default function App() {
  const [currentView, setCurrentView] = useState("login");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [redirectData, setRedirectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [graphView, setGraphView] = useState("day");

  useEffect(() => {
    document.title = "Linker";
  }, []);

  const handleLogout = () => {
    setToken("");
    setUser(null);
    setUrls([]);
    setSelectedUrl(null);
    setRedirectData([]);
    setCurrentView("login");
  };

  const processRedirectData = (redirects, interval = "day") => {
    if (!redirects?.length) return [];

    const grouped = redirects.reduce((acc, timestamp) => {
      const date = new Date(timestamp);
      let key;

      switch (interval) {
        case "minute":
          key = date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          break;
        case "hour":
          key =
            date.toLocaleString("en-US", {
              hour: "2-digit",
              hour12: false,
            }) + ":00";
          break;
        default: 
          key = date.toLocaleDateString();
      }

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, clicks]) => ({
        date,
        clicks,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("grant_type", "password");

        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Login failed");
        }

        const data = await response.json();
        setToken(data.access_token);

        const userResponse = await fetch("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setCurrentView("dashboard");

          const urlsResponse = await fetch(
            "http://localhost:8000/api/me/urls",
            {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            }
          );

          if (urlsResponse.ok) {
            const urlsData = await urlsResponse.json();
            setUrls(urlsData);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Form onSubmit={handleSubmit}>
        {error && <ErrorText>{error}</ErrorText>}
        <FormGroup>
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormGroup>
        <Button type="submit" $fullWidth disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : "Login"}
        </Button>
      </Form>
    );
  }

  function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            full_name: fullName || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Registration failed");
        }

        setCurrentView("login");
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Form onSubmit={handleSubmit}>
        {error && <ErrorText>{error}</ErrorText>}
        <FormGroup>
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            pattern="^[a-zA-Z0-9_]+$"
            minLength={3}
            maxLength={20}
            placeholder="Enter username"
          />
          <ErrorText>Only letters, numbers, and underscores allowed</ErrorText>
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Enter password"
          />
          <ErrorText>Minimum 8 characters</ErrorText>
        </FormGroup>

        <Button type="submit" $fullWidth disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : "Register"}
        </Button>
      </Form>
    );
  }

  function URLForm() {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8000/api/me/urls", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || "Failed to create URL");
        }

        const newUrl = await response.json();
        setUrls((prevUrls) => [newUrl, ...prevUrls]);
        setUrl("");
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Form $layout="horizontal" onSubmit={handleSubmit}>
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your long URL here"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <LinkIcon size={16} /> Remake
            </>
          )}
        </Button>
        {error && <ErrorText>{error}</ErrorText>}
      </Form>
    );
  }

  function URLList() {
    const handleUrlSelect = async (url) => {
      setSelectedUrl(url);
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/me/links/${url.short}/redirects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const stats = await response.json();
          setRedirectData(stats);
        }
      } catch (error) {
        console.error("Failed to fetch URL stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleShortLinkClick = async (url, e) => {
      e.preventDefault();
      e.stopPropagation();

      setUrls(
        urls.map((u) => {
          if (u.short === url.short) {
            return { ...u, redirects: u.redirects + 1 };
          }
          return u;
        })
      );

      window.open(`http://localhost:8000/${url.short}`, "_blank");
    };

    const handleFullLinkClick = (url, e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open(url.url, "_blank");
    };

    return (
      <div>
        <StyledUrlList>
          {urls.map((url) => (
            <UrlCard
              key={url.short}
              style={{ background: "#222222", border: "1px solid #3b3b3b" }}
            >
              <UrlCardContent>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href={`http://localhost:8000/${url.short}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleShortLinkClick(url, e)}
                      style={{
                        color: "white",
                        textDecoration: "none",
                        padding: "4px 8px",
                        margin: "-4px -8px",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#3b3b3b")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      http://localhost:8000/{url.short}
                    </a>
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "0.875rem",
                        color: "#636363",
                      }}
                    >
                      • {url.redirects} clicks
                    </span>
                  </div>
                  <div>
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleFullLinkClick(url, e)}
                      style={{
                        fontSize: "0.875rem",
                        color: "#636363",
                        textDecoration: "none",
                        padding: "4px 8px",
                        margin: "-4px -8px",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background = "#3b3b3b")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background = "transparent")
                      }
                    >
                      {url.url}
                    </a>
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUrlSelect(url);
                    }}
                    style={{
                      padding: "4px 8px",
                    }}
                  >
                    Stats
                  </Button>
                  <ExternalLinkStyled
                    href={`http://localhost:8000/${url.short}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleShortLinkClick(url, e)}
                    title="Open shortened link"
                    style={{
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#3b3b3b")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    <ExternalLink size={20} />
                  </ExternalLinkStyled>
                </div>
              </UrlCardContent>
            </UrlCard>
          ))}
          {urls.length === 0 && (
            <UrlText style={{ textAlign: "center", padding: "2rem 0" }}>
              No links yet. Create your first shortened link above!
            </UrlText>
          )}
        </StyledUrlList>
      </div>
    );
  }
  const renderLogin = () => (
    <Card>
      <Title>
        <Link2 size={28} /> Welcome to Linker
      </Title>
      <LoginForm />
      <LinkButton onClick={() => setCurrentView("register")}>
        New to Linker? Register now <ChevronRight size={16} />
      </LinkButton>
    </Card>
  );

  const renderRegister = () => (
    <Card>
      <Title>
        <UserPlus size={28} /> Join Linker
      </Title>
      <RegisterForm />
      <LinkButton onClick={() => setCurrentView("login")}>
        Already a Linker user? Login <ChevronRight size={16} />
      </LinkButton>
    </Card>
  );

  const renderDashboard = () => (
    <Card $maxWidth="56rem">
      <Header>
        <Title>
          <Link2 size={28} /> Linker Dashboard
        </Title>
        <Button $variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Header>

      <Section>
        <Subtitle>
          <LinkIcon size={20} /> Create New Link
        </Subtitle>
        <URLForm />
      </Section>

      <Section>
        <Subtitle>
          <List size={20} /> Your Links
        </Subtitle>
        <URLList />
      </Section>

      {selectedUrl && (
        <Section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Subtitle>Click Statistics</Subtitle>
          </div>
          <ChartWrapper>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                {["minute", "hour", "day"].map((interval) => (
                  <div key={interval}>
                    <h4
                      style={{
                        marginBottom: "1rem",
                        color: "#636363",
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Clicks by {interval}
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={processRedirectData(redirectData, interval)}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#3b3b3b" />
                        <XAxis dataKey="date" stroke="#636363" />
                        <YAxis stroke="#636363" />
                        <Tooltip
                          contentStyle={{
                            background: "#222222",
                            border: "1px solid #3b3b3b",
                            borderRadius: "4px",
                            color: "#ffffff",
                          }}
                        />
                        <Bar dataKey="clicks" fill="#636363" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            )}
          </ChartWrapper>
        </Section>
      )}
    </Card>
  );

  return (
    <>
      <GlobalStyle />
      <Container>
        {currentView === "login" && renderLogin()}
        {currentView === "register" && renderRegister()}
        {currentView === "dashboard" && renderDashboard()}
      </Container>
    </>
  );
}
