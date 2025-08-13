--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 17.4

-- Started on 2025-08-14 05:37:21 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 230 (class 1255 OID 34834)
-- Name: set_created_by_self(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_created_by_self() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := NEW.id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_created_by_self() OWNER TO postgres;

--
-- TOC entry 231 (class 1255 OID 34835)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

--
-- TOC entry 232 (class 1255 OID 34836)
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 34949)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(100) NOT NULL,
    type integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 34948)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 228
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 214 (class 1259 OID 34837)
-- Name: import_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_jobs (
    id uuid NOT NULL,
    filename character varying(255),
    status character varying(50),
    total_rows integer DEFAULT 0,
    success_rows integer DEFAULT 0,
    failed_rows integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    vendor_id integer,
    user_id integer
);


ALTER TABLE public.import_jobs OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 34845)
-- Name: import_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_logs (
    id integer NOT NULL,
    job_id uuid,
    row_number integer,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.import_logs OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 34851)
-- Name: import_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.import_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.import_logs_id_seq OWNER TO postgres;

--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 216
-- Name: import_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.import_logs_id_seq OWNED BY public.import_logs.id;


--
-- TOC entry 217 (class 1259 OID 34852)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(12,2) DEFAULT 0.00 NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 34861)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 218
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 223 (class 1259 OID 34910)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id character varying NOT NULL,
    name character varying,
    phone character varying,
    inv_code character varying,
    user_id integer,
    status integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer,
    expire_at timestamp with time zone
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 34918)
-- Name: transactionsdetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactionsdetails (
    id bigint NOT NULL,
    transaction_id character varying NOT NULL,
    name character varying,
    code text,
    key text,
    hpp numeric DEFAULT '0'::numeric,
    margin_type integer DEFAULT 0,
    margin_amount numeric DEFAULT '0'::numeric,
    discount_type integer DEFAULT 0,
    discount_amount numeric DEFAULT '0'::numeric,
    quantity integer DEFAULT 0,
    price numeric DEFAULT '0'::numeric,
    total numeric DEFAULT '0'::numeric,
    type integer DEFAULT 0,
    status integer DEFAULT 0,
    active boolean DEFAULT false,
    ongkir numeric DEFAULT '0'::numeric,
    total_hpp numeric DEFAULT 0,
    total_margin numeric DEFAULT 0,
    product_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.transactionsdetails OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 34917)
-- Name: transactionsdetails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.transactionsdetails ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transactionsdetails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 34940)
-- Name: transactionspayments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactionspayments (
    id bigint NOT NULL,
    transaction_id character varying NOT NULL,
    bank_value character varying,
    va_number numeric,
    va_status character varying,
    va_fraud character varying,
    data json,
    type integer,
    status integer,
    active boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    amount numeric
);


ALTER TABLE public.transactionspayments OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 34939)
-- Name: transactionspayments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.transactionspayments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.transactionspayments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999999999999
    CACHE 1
    CYCLE
);


--
-- TOC entry 219 (class 1259 OID 34862)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    type integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 34869)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 221 (class 1259 OID 34870)
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    address text,
    phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    created_by integer,
    updated_by integer,
    deleted_by integer
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 34877)
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO postgres;

--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 222
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- TOC entry 3250 (class 2604 OID 34952)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 3222 (class 2604 OID 34878)
-- Name: import_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs ALTER COLUMN id SET DEFAULT nextval('public.import_logs_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 34879)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 34880)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3232 (class 2604 OID 34881)
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- TOC entry 3436 (class 0 OID 34949)
-- Dependencies: 229
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.customers VALUES (6, 'Hilman', '082321283660', 0, '2025-08-14 05:30:10.96', '2025-08-13 22:30:11.064039', NULL, NULL, NULL, NULL);


--
-- TOC entry 3421 (class 0 OID 34837)
-- Dependencies: 214
-- Data for Name: import_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.import_jobs VALUES ('029a7795-cc8c-409d-8713-2be8c9546274', 'products-shopping/1755122373849_1755122546273_Test Bull Spreadsheet (1).xlsx', 'success', 4, 4, 0, '2025-08-13 22:02:26.7541', '2025-08-14 05:02:26.944', 6, NULL);


--
-- TOC entry 3422 (class 0 OID 34845)
-- Dependencies: 215
-- Data for Name: import_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3424 (class 0 OID 34852)
-- Dependencies: 217
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES (959, 6, 'Baru', 'Baru Loh', 100000.00, 120, '2025-08-13 22:02:26.896387', '2025-08-13 22:02:26.896387', NULL, 0, NULL, NULL);
INSERT INTO public.products VALUES (960, 6, 'Baru', 'Baru Loh', 100000.00, 120, '2025-08-13 22:02:26.915036', '2025-08-13 22:02:26.915036', NULL, 0, NULL, NULL);
INSERT INTO public.products VALUES (961, 6, 'Baru', 'Baru Loh', 100000.00, 120, '2025-08-13 22:02:26.930263', '2025-08-13 22:02:26.930263', NULL, 0, NULL, NULL);
INSERT INTO public.products VALUES (962, 6, 'Baru', 'Baru Loh', 100000.00, 120, '2025-08-13 22:02:26.945279', '2025-08-13 22:02:26.945279', NULL, 0, NULL, NULL);
INSERT INTO public.products VALUES (958, 6, 'Laptop', 'Laptop Asus Gaming', 1000000.00, 19, '2025-08-13 22:01:54.06448', '2025-08-13 22:01:54.06448', NULL, 3, NULL, NULL);


--
-- TOC entry 3430 (class 0 OID 34910)
-- Dependencies: 223
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transactions VALUES ('70df1e9f-4e6c-4574-b3c4-d80d84301afa', 'Hilman', '082321283660', 'inv-647b11e5-ca16-4d02-bcea-fef65c625119', 6, 1, '2025-08-13 22:30:11.019+00', NULL, NULL, NULL, NULL, NULL, '2025-08-13 22:35:11+00');


--
-- TOC entry 3432 (class 0 OID 34918)
-- Dependencies: 225
-- Data for Name: transactionsdetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transactionsdetails OVERRIDING SYSTEM VALUE VALUES (109, '70df1e9f-4e6c-4574-b3c4-d80d84301afa', 'Admin Bank', NULL, NULL, 0, 0, 0, 0, 0, 0, 4440, 4440, 0, 0, false, 0, 0, 0, NULL, '2025-08-13 22:30:11.035+00', NULL, NULL);
INSERT INTO public.transactionsdetails OVERRIDING SYSTEM VALUE VALUES (110, '70df1e9f-4e6c-4574-b3c4-d80d84301afa', NULL, NULL, NULL, 0, 0, 0, 0, 0, 1, 1000000, 1000000, 0, 0, false, 0, 0, 0, 958, '2025-08-13 22:30:11.035+00', NULL, NULL);


--
-- TOC entry 3434 (class 0 OID 34940)
-- Dependencies: 227
-- Data for Name: transactionspayments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transactionspayments OVERRIDING SYSTEM VALUE VALUES (42, '70df1e9f-4e6c-4574-b3c4-d80d84301afa', 'bca', 66024644847901157945278, 'settlement', 'accept', '{"status_code":"201","status_message":"Success, Bank Transfer transaction is created","transaction_id":"6db8ecfc-4989-4632-aedb-078028b1780c","order_id":"70df1e9f-4e6c-4574-b3c4-d80d84301afa","merchant_id":"G676266024","gross_amount":"1004440.00","currency":"IDR","payment_type":"bank_transfer","transaction_time":"2025-08-14 05:30:11","transaction_status":"pending","fraud_status":"accept","va_numbers":[{"bank":"bca","va_number":"66024644847901157945278"}],"expiry_time":"2025-08-14 05:35:10"}', 0, 0, true, '2025-08-13 22:30:15+00', NULL, NULL, 1004440);


--
-- TOC entry 3426 (class 0 OID 34862)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (3, 'Depok', 'super@gmail.com', '$2b$10$pEhX/tac6ubC6bWtFiaotO249NmzT.70lDiguI32KEX/FlLhq6X1e', 0, '2025-08-13 21:56:16.991483', '2025-08-13 21:56:16.991483', NULL, 3, NULL, NULL);


--
-- TOC entry 3428 (class 0 OID 34870)
-- Dependencies: 221
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vendors VALUES (6, 3, 'garin', 'depok', '089657770131', '2025-08-13 22:01:19.662252', '2025-08-13 22:01:19.662252', NULL, 3, NULL, NULL);


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 228
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 6, true);


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 216
-- Name: import_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.import_logs_id_seq', 1, false);


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 218
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 962, true);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 224
-- Name: transactionsdetails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactionsdetails_id_seq', 110, true);


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 226
-- Name: transactionspayments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactionspayments_id_seq', 42, true);


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 222
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 6, true);


--
-- TOC entry 3272 (class 2606 OID 34958)
-- Name: customers customers_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key UNIQUE (phone);


--
-- TOC entry 3274 (class 2606 OID 34956)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3254 (class 2606 OID 34883)
-- Name: import_jobs import_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_jobs
    ADD CONSTRAINT import_jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 34885)
-- Name: import_logs import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT import_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3258 (class 2606 OID 34887)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3266 (class 2606 OID 34916)
-- Name: transactions transactions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pk PRIMARY KEY (id);


--
-- TOC entry 3268 (class 2606 OID 34938)
-- Name: transactionsdetails transactionsdetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactionsdetails
    ADD CONSTRAINT transactionsdetails_pkey PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 34946)
-- Name: transactionspayments transactionspayments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactionspayments
    ADD CONSTRAINT transactionspayments_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 34889)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3262 (class 2606 OID 34891)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 34893)
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- TOC entry 3278 (class 2620 OID 34894)
-- Name: users trg_set_created_by; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_set_created_by BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_created_by_self();


--
-- TOC entry 3275 (class 2606 OID 34895)
-- Name: import_logs import_logs_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT import_logs_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.import_jobs(id) ON DELETE CASCADE;


--
-- TOC entry 3276 (class 2606 OID 34900)
-- Name: products products_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 3277 (class 2606 OID 34905)
-- Name: vendors vendors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-08-14 05:37:23 WIB

--
-- PostgreSQL database dump complete
--

