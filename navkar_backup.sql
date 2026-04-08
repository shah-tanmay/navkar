--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

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
-- Name: reservation_item; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reservation_item AS (
	product_variant_id uuid,
	quantity integer
);


ALTER TYPE public.reservation_item OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ad_spend_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ad_spend_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    log_date date NOT NULL,
    meta_spend numeric(10,2) DEFAULT 0,
    google_spend numeric(10,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ad_spend_logs OWNER TO postgres;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    street character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character varying(100) NOT NULL,
    phone character varying(15),
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    landmark text,
    type text DEFAULT 'home'::text
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    product_variant_id uuid,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    state_id integer NOT NULL
);


ALTER TABLE public.cities OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cities_id_seq OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    type character varying(20) NOT NULL,
    value numeric(10,2) NOT NULL,
    expiry_date timestamp without time zone,
    usage_limit integer,
    used_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_variant_id uuid NOT NULL,
    quantity_total integer DEFAULT 0 NOT NULL,
    quantity_reserved integer DEFAULT 0 NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    product_variant_id uuid NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_tracking (
    id integer NOT NULL,
    order_id uuid,
    order_token character varying(21),
    tracking_status character varying(50) NOT NULL,
    changed_at timestamp without time zone DEFAULT now() NOT NULL,
    notes text
);


ALTER TABLE public.order_tracking OWNER TO postgres;

--
-- Name: order_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_tracking_id_seq OWNER TO postgres;

--
-- Name: order_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_tracking_id_seq OWNED BY public.order_tracking.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    payment_method character varying(50) DEFAULT 'razorpay'::character varying,
    shipping_address_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    order_token character varying(21),
    CONSTRAINT order_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'shipped'::character varying, 'checked_out'::character varying, 'paid'::character varying, 'cancelled'::character varying, 'confirmed'::character varying])::text[]))),
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['razorpay'::character varying, 'cod'::character varying])::text[]))),
    CONSTRAINT orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'failed'::character varying, 'completed'::character varying, 'refunded'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    order_id uuid,
    razorpay_payment_id character varying(255),
    razorpay_order_id character varying(255),
    status character varying(50) DEFAULT 'pending'::character varying,
    amount numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'success'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    product_id uuid NOT NULL,
    category_id uuid NOT NULL
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid,
    color character varying(255) NOT NULL,
    color_hex_code character(7),
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    image_url text,
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    type text DEFAULT 'window'::text,
    weight numeric(10,2) DEFAULT 0.5,
    slug text
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    image_url text,
    created_at timestamp without time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    is_discontinued boolean DEFAULT false,
    tag character varying(255) DEFAULT 'sale'::character varying
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id bigint NOT NULL,
    product_variant_id uuid NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    last_heartbeat timestamp with time zone DEFAULT now() NOT NULL,
    status text NOT NULL,
    order_token character varying(21),
    CONSTRAINT reservations_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT reservations_status_check CHECK ((status = ANY (ARRAY['active'::text, 'confirmed'::text, 'expired'::text, 'cancelled'::text])))
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_id_seq OWNER TO postgres;

--
-- Name: reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;


--
-- Name: serviceable_pincodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.serviceable_pincodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pincode character varying(10) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.serviceable_pincodes OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.states (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL
);


ALTER TABLE public.states OWNER TO postgres;

--
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.states_id_seq OWNER TO postgres;

--
-- Name: states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.states_id_seq OWNED BY public.states.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    phone character varying(15),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    product_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: order_tracking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracking ALTER COLUMN id SET DEFAULT nextval('public.order_tracking_id_seq'::regclass);


--
-- Name: reservations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);


--
-- Name: states id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states ALTER COLUMN id SET DEFAULT nextval('public.states_id_seq'::regclass);


--
-- Data for Name: ad_spend_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ad_spend_logs (id, log_date, meta_spend, google_spend, created_at) FROM stdin;
\.


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, user_id, street, city, state, postal_code, country, phone, is_default, created_at, updated_at, landmark, type) FROM stdin;
00335320-4e49-4720-a526-39828fcda9d3	d65a13e3-0fe8-4c38-9248-86e847f5e6a1	Ichalkaranji	Pune	Maharashtra	416116	India	\N	f	2025-03-19 17:03:11.806043	2025-03-19 17:03:11.806043	landmarkone	home
865f236d-ec41-4fef-a6af-f93898a38c69	d65a13e3-0fe8-4c38-9248-86e847f5e6a1	Ichalkaranji	Pune	Maharashtra	416116	India	\N	f	2025-03-29 07:35:53.709971	2025-03-29 07:35:53.709971	landmarkone	home
1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	32be4fea-c4be-4dec-81c5-afec41063bce	C1-904, Corona Housing Society::Katraj Kondhwa Road	Pune	Maharashtra	411048	India	+919156834423	f	2025-03-31 14:57:26.281285	2025-04-10 12:15:33.369646	Near Shantiban Society	Home
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, user_id, product_variant_id, quantity, created_at, updated_at) FROM stdin;
75a1f94c-eaf3-4cf2-855c-5a74114c0ec3	d65a13e3-0fe8-4c38-9248-86e847f5e6a1	a749d064-cec4-4612-8227-03f919e197aa	6	2025-03-18 14:16:21.368089	2026-04-07 12:25:07.289136
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name) FROM stdin;
6ac28147-2899-41e8-bec3-c9e47921601b	Luxe Drapes
dab29e45-212f-4ce7-8cb4-35fbd7ed581a	Patterned Drapes
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cities (id, name, state_id) FROM stdin;
1	Bamboo Flat	1
2	Nicobar	1
3	Port Blair	1
4	South Andaman	1
5	Addanki	2
6	Adoni	2
7	Akasahebpet	2
8	Akividu	2
9	Akkarampalle	2
10	Amalapuram	2
11	Amudalavalasa	2
12	Anakapalle	2
13	Anantapur	2
14	Atmakur	2
15	Attili	2
16	Avanigadda	2
17	Badvel	2
18	Banganapalle	2
19	Bapatla	2
20	Betamcherla	2
21	Bhattiprolu	2
22	Bhimavaram	2
23	Bhimunipatnam	2
24	Bobbili	2
25	Challapalle	2
26	Chemmumiahpet	2
27	Chilakalurupet	2
28	Chinnachowk	2
29	Chipurupalle	2
30	Chirala	2
31	Chittoor	2
32	Chodavaram	2
33	Cuddapah	2
34	Cumbum	2
35	Darsi	2
36	Dharmavaram	2
37	Dhone	2
38	Diguvametta	2
39	East Godavari	2
40	Elamanchili	2
41	Ellore	2
42	Emmiganur	2
43	Erraguntla	2
44	Etikoppaka	2
45	Gajuwaka	2
46	Ganguvada	2
47	Gannavaram	2
48	Giddalur	2
49	Gokavaram	2
50	Gorantla	2
51	GovindapuramChilakaluripetGuntur	2
52	Gudivada	2
53	Gudlavalleru	2
54	Gudur	2
55	Guntakal Junction	2
56	Guntur	2
57	Hindupur	2
58	Ichchapuram	2
59	Jaggayyapeta	2
60	Jammalamadugu	2
61	Kadiri	2
62	Kaikalur	2
63	Kakinada	2
64	Kalyandurg	2
65	Kamalapuram	2
66	Kandukur	2
67	Kanigiri	2
68	Kankipadu	2
69	Kanuru	2
70	Kavali	2
71	Kolanukonda	2
72	Kondapalle	2
73	Korukollu	2
74	Kosigi	2
75	Kovvur	2
76	Krishna	2
77	Kuppam	2
78	Kurnool	2
79	Macherla	2
80	Machilipatnam	2
81	Madanapalle	2
82	Madugula	2
83	Mandapeta	2
84	Mandasa	2
85	Mangalagiri	2
86	Markapur	2
87	Nagari	2
88	Nagireddipalli	2
89	Nandigama	2
90	Nandikotkur	2
91	Nandyal	2
92	Narasannapeta	2
93	Narasapur	2
94	Narasaraopet	2
95	Narasingapuram	2
96	Narayanavanam	2
97	Narsipatnam	2
98	Nayudupet	2
99	Nellore	2
100	Nidadavole	2
101	Nuzvid	2
102	Ongole	2
103	Pakala	2
104	Palakollu	2
105	Palasa	2
106	Palkonda	2
107	Pallevada	2
108	Palmaner	2
109	Parlakimidi	2
110	Parvatipuram	2
111	Pavuluru	2
112	Pedana	2
113	pedda nakkalapalem	2
114	Peddapuram	2
115	Penugonda	2
116	Penukonda	2
117	Phirangipuram	2
118	Pippara	2
119	Pithapuram	2
120	Polavaram	2
121	Ponnur	2
122	Ponnuru	2
123	Prakasam	2
124	Proddatur	2
125	Pulivendla	2
126	Punganuru	2
127	Puttaparthi	2
128	Puttur	2
129	Rajahmundry	2
130	Ramachandrapuram	2
131	Ramanayyapeta	2
132	Ramapuram	2
133	Rampachodavaram	2
134	Rayachoti	2
135	Rayadrug	2
136	Razam	2
137	Razampeta	2
138	Razole	2
139	Renigunta	2
140	Repalle	2
141	Salur	2
142	Samalkot	2
143	Sattenapalle	2
144	Singarayakonda	2
145	Sompeta	2
146	Srikakulam	2
147	Srisailain	2
148	Suluru	2
149	Tadepalle	2
150	Tadepallegudem	2
151	Tadpatri	2
152	Tanuku	2
153	Tekkali	2
154	Tirumala	2
155	Tirupati	2
156	Tuni	2
157	Uravakonda	2
158	vadlamuru	2
159	Vadlapudi	2
160	Venkatagiri	2
161	Vepagunta	2
162	Vetapalem	2
163	Vijayawada	2
164	Vinukonda	2
165	Visakhapatnam	2
166	Vizianagaram	2
167	Vizianagaram District	2
168	Vuyyuru	2
169	West Godavari	2
170	Yanam	2
171	Yanamalakuduru	2
172	Yarada	2
173	Along	3
174	Anjaw	3
175	Basar	3
176	Bomdila	3
177	Changlang	3
178	Dibang Valley	3
179	East Kameng	3
180	East Siang	3
181	Hayuliang	3
182	Itanagar	3
183	Khonsa	3
184	Kurung Kumey	3
185	Lohit District	3
186	Lower Dibang Valley	3
187	Lower Subansiri	3
188	Margherita	3
189	Naharlagun	3
190	Pasighat	3
191	Tawang	3
192	Tezu	3
193	Tirap	3
194	Upper Siang	3
195	Upper Subansiri	3
196	West Kameng	3
197	West Siang	3
198	Ziro	3
199	Abhayapuri	4
200	Amguri	4
201	Badarpur	4
202	Baksa	4
203	Barpathar	4
204	Barpeta	4
205	Barpeta Road	4
206	Basugaon	4
207	Bihpuriagaon	4
208	Bijni	4
209	Bilasipara	4
210	Bokajan	4
211	Bokakhat	4
212	Bongaigaon	4
213	Cachar	4
214	Chabua	4
215	Chapar	4
216	Chirang	4
217	Darrang	4
218	Dergaon	4
219	Dhekiajuli	4
220	Dhemaji	4
221	Dhing	4
222	Dhubri	4
223	Dibrugarh	4
224	Digboi	4
225	Dima Hasao District	4
226	Diphu	4
227	Dispur	4
228	Duliagaon	4
229	Dum Duma	4
230	Gauripur	4
231	Goalpara	4
232	Gohpur	4
233	Golaghat	4
234	Golakganj	4
235	Goshaingaon	4
236	Guwahati	4
237	Haflong	4
238	Hailakandi	4
239	Hajo	4
240	Hojai	4
241	Howli	4
242	Jogighopa	4
243	Jorhat	4
244	Kamrup	4
245	Kamrup Metropolitan	4
246	Karbi Anglong	4
247	Karimganj	4
248	Kharupatia	4
249	Kokrajhar	4
250	Lakhimpur	4
251	Lakhipur	4
252	Lala	4
253	Lumding Railway Colony	4
254	Mahur	4
255	Maibong	4
256	Makum	4
257	Mangaldai	4
258	Mariani	4
259	Moranha	4
260	Morigaon	4
261	Nagaon	4
262	Nahorkatiya	4
263	Nalbari	4
264	Namrup	4
265	Nazira	4
266	North Guwahati	4
267	North Lakhimpur	4
268	Numaligarh	4
269	Palasbari	4
270	Raha	4
271	Rangapara	4
272	Rangia	4
273	Sapatgram	4
274	Sarupathar	4
275	Sibsagar	4
276	Silapathar	4
277	Silchar	4
278	Soalkuchi	4
279	Sonari	4
280	Sonitpur	4
281	Sorbhog	4
282	Tezpur	4
283	Tinsukia	4
284	Titabar	4
285	Udalguri	4
286	Amarpur	5
287	Araria	5
288	Arrah	5
289	Arwal	5
290	Asarganj	5
291	Aurangabad	5
292	Bagaha	5
293	Bahadurganj	5
294	Bairagnia	5
295	Baisi	5
296	Bakhtiyarpur	5
297	Bangaon	5
298	Banka	5
299	Banmankhi	5
300	Bar Bigha	5
301	Barauli	5
302	Barh	5
303	Barhiya	5
304	Bariarpur	5
305	Baruni	5
306	Begusarai	5
307	Belsand	5
308	Bettiah	5
309	Bhabhua	5
310	Bhagalpur	5
311	Bhagirathpur	5
312	Bhawanipur	5
313	Bhojpur	5
314	Bihar Sharif	5
315	Bihariganj	5
316	Bikramganj	5
317	Birpur	5
318	Bodh Gaya	5
319	Buxar	5
320	Chakia	5
321	Chapra	5
322	Chhatapur	5
323	Colgong	5
324	Dalsingh Sarai	5
325	Darbhanga	5
326	Daudnagar	5
327	Dehri	5
328	Dhaka	5
329	Dighwara	5
330	Dinapore	5
331	Dumra	5
332	Dumraon	5
333	Fatwa	5
334	Forbesganj	5
335	Gaya	5
336	Ghoga	5
337	Gopalganj	5
338	Hajipur	5
339	Hilsa	5
340	Hisua	5
341	Islampur	5
342	Jagdispur	5
343	Jahanabad	5
344	Jamalpur	5
345	Jamui	5
346	Jaynagar	5
347	Jehanabad	5
348	Jha-Jha	5
349	Jhanjharpur	5
350	Jogbani	5
351	Kaimur District	5
352	Kasba	5
353	Katihar	5
354	Khagaria	5
355	Khagaul	5
356	Kharagpur	5
357	Khusropur	5
358	Kishanganj	5
359	Koath	5
360	Koelwar	5
361	Lakhisarai	5
362	Lalganj	5
363	Luckeesarai	5
364	Madhepura	5
365	Madhubani	5
366	Maharajgani	5
367	Mairwa	5
368	Maner	5
369	Manihari	5
370	Marhaura	5
371	Masaurhi Buzurg	5
372	Mohiuddi nagar	5
373	Mokameh	5
374	Monghyr	5
375	Mothihari	5
376	Munger	5
377	Murliganj	5
378	Muzaffarpur	5
379	Nabinagar	5
380	Nalanda	5
381	Nasriganj	5
382	Naugachhia	5
383	Nawada	5
384	Nirmali	5
385	Pashchim Champaran	5
386	Patna	5
387	Piro	5
388	Pupri	5
389	Purba Champaran	5
390	Purnia	5
391	Rafiganj	5
392	Raghunathpur	5
393	Rajgir	5
394	Ramnagar	5
395	Raxaul	5
396	Revelganj	5
397	Rohtas	5
398	Rusera	5
399	Sagauli	5
400	Saharsa	5
401	Samastipur	5
402	Saran	5
403	Shahbazpur	5
404	Shahpur	5
405	Sheikhpura	5
406	Sheohar	5
407	Sherghati	5
408	Silao	5
409	Sitamarhi	5
410	Siwan	5
411	Supaul	5
412	Teghra	5
413	Tekari	5
414	Thakurganj	5
415	Vaishali	5
416	Waris Aliganj	5
417	Chandigarh	6
418	Akaltara	7
419	Ambagarh Chauki	7
420	Ambikapur	7
421	Arang	7
422	Baikunthpur	7
423	Balod	7
424	Baloda	7
425	Baloda Bazar	7
426	Basna	7
427	Bastar	7
428	Bemetara	7
429	Bhanpuri	7
430	Bhatapara	7
431	Bhatgaon	7
432	Bhilai	7
433	Bijapur	7
434	Bilaspur	7
435	Champa	7
436	Chhuikhadan	7
437	Dantewada	7
438	Deori	7
439	Dhamtari	7
440	Dongargaon	7
441	Dongargarh	7
442	Durg	7
443	Gandai	7
444	Gariaband	7
445	Gaurela	7
446	Gharghoda	7
447	Gidam	7
448	Jagdalpur	7
449	Janjgir	7
450	Janjgir-Champa	7
451	Jashpur	7
452	Jashpurnagar	7
453	Junagarh	7
454	Kabeerdham	7
455	Kanker	7
456	Katghora	7
457	Kawardha	7
458	Khairagarh	7
459	Khamharia	7
460	Kharod	7
461	Kharsia	7
462	Kirandul	7
463	Kondagaon	7
464	Korba	7
465	Koria	7
466	Kota	7
467	Kotaparh	7
468	Kumhari	7
469	Kurud	7
470	Lormi	7
471	Mahasamund	7
472	Mungeli	7
473	Narayanpur	7
474	Narharpur	7
475	Pandaria	7
476	Pandatarai	7
477	Pasan	7
478	Patan	7
479	Pathalgaon	7
480	Pendra	7
481	Pithora	7
482	Raigarh	7
483	Raipur	7
484	Raj Nandgaon	7
485	Ramanuj Ganj	7
486	Ratanpur	7
487	Sakti	7
488	Saraipali	7
489	Sarangarh	7
490	Seorinarayan	7
491	Simga	7
492	Surguja	7
493	Takhatpur	7
494	Umarkot	7
495	Uttar Bastar Kanker	7
496	Amli	8
497	Dadra	8
498	Dadra & Nagar Haveli	8
499	Daman	8
500	Diu	8
501	Silvassa	8
502	Alipur	9
503	Bawana	9
504	Central Delhi	9
505	Delhi	9
506	Deoli	9
507	East Delhi	9
508	Karol Bagh	9
509	Najafgarh	9
510	Nangloi Jat	9
511	Narela	9
512	New Delhi	9
513	North Delhi	9
514	North East Delhi	9
515	North West Delhi	9
516	Pitampura	9
517	Rohini	9
518	South Delhi	9
519	South West Delhi	9
520	West Delhi	9
521	Aldona	10
522	Arambol	10
523	Baga	10
524	Bambolim	10
525	Bandora	10
526	Benaulim	10
527	Calangute	10
528	Candolim	10
529	Carapur	10
530	Cavelossim	10
531	Chicalim	10
532	Chinchinim	10
533	Colovale	10
534	Colva	10
535	Cortalim	10
536	Cuncolim	10
537	Curchorem	10
538	Curti	10
539	Davorlim	10
540	Dicholi	10
541	Goa Velha	10
542	Guirim	10
543	Jua	10
544	Kankon	10
545	Madgaon	10
546	Mapuca	10
547	Morjim	10
548	Mormugao	10
549	Navelim	10
550	North Goa	10
551	Palle	10
552	Panaji	10
553	Pernem	10
554	Ponda	10
555	Quepem	10
556	Queula	10
557	Raia	10
558	Saligao	10
559	Sancoale	10
560	Sanguem	10
561	Sanquelim	10
562	Sanvordem	10
563	Serula	10
564	Solim	10
565	South Goa	10
566	Taleigao	10
567	Vagator	10
568	Valpoy	10
569	Varca	10
570	Vasco da Gama	10
571	Abrama	11
572	Adalaj	11
573	Agol	11
574	Ahmedabad	11
575	Ahwa	11
576	Akrund	11
577	Amod	11
578	Amreli	11
579	Amroli	11
580	Anand	11
581	Anjar	11
582	Ankleshwar	11
583	Babra	11
584	Bagasara	11
585	Bagasra	11
586	Bakharla	11
587	Balagam	11
588	Balasinor	11
589	Balisana	11
590	Bamanbore	11
591	Banas Kantha	11
592	Bandia	11
593	Bantva	11
594	Bardoli	11
595	Bavla	11
596	Bedi	11
597	Bhachau	11
598	Bhadran	11
599	Bhandu	11
600	Bhanvad	11
601	Bharuch	11
602	Bhatha	11
603	Bhavnagar	11
604	Bhayavadar	11
605	Bhildi	11
606	Bhojpur Dharampur	11
607	Bhuj	11
608	Bilimora	11
609	Bilkha	11
610	Borsad	11
611	Botad	11
612	Chaklasi	11
613	Chalala	11
614	Chaloda	11
615	Champaner	11
616	Chanasma	11
617	Chhala	11
618	Chhota Udepur	11
619	Chikhli	11
620	Chotila	11
621	Chuda	11
622	Dabhoda	11
623	Dabhoi	11
624	Dahegam	11
625	Dahod	11
626	Dakor	11
627	Damnagar	11
628	Dandi	11
629	Dangs (India)	11
630	Danta	11
631	Dayapar	11
632	Delvada	11
633	Delwada	11
634	Detroj	11
635	Devbhumi Dwarka	11
636	Devgadh Bariya	11
637	Dhandhuka	11
638	Dhanera	11
639	Dhansura	11
640	Dharampur	11
641	Dharasana	11
642	Dhari	11
643	Dhasa	11
644	Dhola	11
645	Dholera	11
646	Dholka	11
647	Dhoraji	11
648	Dhrangadhra	11
649	Dhrol	11
650	Dhuwaran	11
651	Disa	11
652	Dohad	11
653	Dumkhal	11
654	Dungarpur	11
655	Dwarka	11
656	Gadhada	11
657	Gandevi	11
658	Gandhidham	11
659	Gandhinagar	11
660	Gariadhar	11
661	Ghodasar	11
662	Ghogha	11
663	Gir Somnath	11
664	Godhra	11
665	Gondal	11
666	Gorwa	11
667	Halenda	11
668	Halol	11
669	Halvad	11
670	Hansot	11
671	Harij	11
672	Harsol	11
673	Hathuran	11
674	Himatnagar	11
675	Idar	11
676	Jakhau	11
677	Jalalpore	11
678	Jalalpur	11
679	Jalia	11
680	Jambuda	11
681	Jambusar	11
682	Jamnagar	11
683	Jarod	11
684	Jasdan	11
685	Jetalpur	11
686	Jetalsar	11
687	Jetpur	11
688	Jetpur (Navagadh)	11
689	Jhalod	11
690	Jhulasan	11
691	Jodhpur	11
692	Jodhpur (Ahmedabad)	11
693	Jodia	11
694	Jodiya Bandar	11
695	Junagadh	11
696	Kachchh	11
697	Kachholi	11
698	Kadi	11
699	Kadod	11
700	Kalavad	11
701	Kalol	11
702	Kandla	11
703	Kandla port	11
704	Kanodar	11
705	Kapadvanj	11
706	Karamsad	11
707	Kariana	11
708	Karjan	11
709	Kathor	11
710	Katpur	11
711	Kawant	11
712	Kayavarohan	11
713	Kerwada	11
714	Keshod	11
715	Khambhalia	11
716	Khambhat	11
717	Khavda	11
718	Kheda	11
719	Khedbrahma	11
720	Khedoi	11
721	Kherali	11
722	Kheralu	11
723	Kodinar	11
724	Kosamba	11
725	Kothara	11
726	Kotharia	11
727	Kukarmunda	11
728	Kukma	11
729	Kundla	11
730	Kutch district	11
731	Kutiyana	11
732	Ladol	11
733	Lakhpat	11
734	Lakhtar	11
735	Lalpur	11
736	Langhnaj	11
737	Lathi	11
738	Limbdi	11
739	Limkheda	11
740	Lunavada	11
741	Madhavpur Ghed	11
742	Madhi	11
743	Mahemdavad	11
744	Mahesana	11
745	Mahisa	11
746	Mahudha	11
747	Mahuva	11
748	Mahuva (Surat)	11
749	Malpur	11
750	Manavadar	11
751	Mandal	11
752	Mandvi	11
753	Mandvi (Surat)	11
754	Mangrol	11
755	Mangrol (Junagadh)	11
756	Mansa	11
757	Meghraj	11
758	Mehsana	11
759	Mendarda	11
760	Mithapur	11
761	Modasa	11
762	Morbi	11
763	Morva (Hadaf)	11
764	Morwa	11
765	Mundra	11
766	Nadiad	11
767	Nagwa	11
768	Naldhara	11
769	Naliya	11
770	Nargol	11
771	Narmada	11
772	Naroda	11
773	Navsari	11
774	Nikora	11
775	Nizar	11
776	Odadar	11
777	Okha	11
778	Olpad	11
779	Paddhari	11
780	Padra	11
781	Palanpur	11
782	Palanswa	11
783	Palitana	11
784	Paliyad	11
785	Palsana	11
786	Panch Mahals	11
787	Panchmahal district	11
788	Pardi	11
789	Parnera	11
790	Patan	11
791	Pavi Jetpur	11
792	Petlad	11
793	Pipavav	11
794	Piplod	11
795	Porbandar	11
796	Prabhas Patan	11
797	Prantij	11
798	Radhanpur	11
799	Rajkot	11
800	Rajpipla	11
801	Rajula	11
802	Ranavav	11
803	Ranpur	11
804	Rapar	11
805	Reha	11
806	Roha	11
807	Sabar Kantha	11
808	Sachin	11
809	Salaya	11
810	Samakhiali	11
811	Sanand	11
812	Sankheda	11
813	Sarbhon	11
814	Sardoi	11
815	Sarkhej	11
816	Sathamba	11
817	Savarkundla	11
818	Savli	11
819	Sayla	11
820	Shahpur	11
821	Shivrajpur	11
822	Siddhpur	11
823	Sihor	11
824	Sikka	11
825	Sinor	11
826	Sojitra	11
827	Songadh	11
828	Supedi	11
829	Surat	11
830	Surendranagar	11
831	Sutrapada	11
832	Talaja	11
833	Tankara	11
834	Tapi	11
835	Than	11
836	Thangadh	11
837	Tharad	11
838	Thasra	11
839	The Dangs	11
840	Umarpada	11
841	Umrala	11
842	Umreth	11
843	Un	11
844	Una	11
845	Unjha	11
846	Upleta	11
847	Utran	11
848	Vadgam	11
849	Vadnagar	11
850	Vadodara	11
851	Vaghodia	11
852	Vaghodia INA	11
853	Vallabh Vidyanagar	11
854	Vallabhipur	11
855	Valsad	11
856	Vanala	11
857	Vansda	11
858	Vanthli	11
859	Vapi	11
860	Vartej	11
861	Vasa	11
862	Vasavad	11
863	Vaso	11
864	Vataman	11
865	Vejalpur	11
866	Veraval	11
867	Vijapur	11
868	Vinchhiya	11
869	Viramgam	11
870	Virpur	11
871	Visavadar	11
872	Visnagar	11
873	Vyara	11
874	Wadhai	11
875	Wadhwan	11
876	Waghai	11
877	Wankaner	11
878	Ambala	12
879	Asandh	12
880	Ateli Mandi	12
881	Bahadurgarh	12
882	Bara Uchana	12
883	Barwala	12
884	Bawal	12
885	Beri Khas	12
886	Bhiwani	12
887	Bilaspur	12
888	Buriya	12
889	Charkhi Dadri	12
890	Chhachhrauli	12
891	Dabwali	12
892	Dharuhera	12
893	Ellenabad	12
894	Faridabad	12
895	Farrukhnagar	12
896	Fatehabad	12
897	Firozpur Jhirka	12
898	Gharaunda	12
899	Gohana	12
900	Gorakhpur	12
901	Gurgaon	12
902	Hansi	12
903	Hasanpur	12
904	Hisar	12
905	Hodal	12
906	Inda Chhoi	12
907	Indri	12
908	Jagadhri	12
909	Jakhal	12
910	Jhajjar	12
911	Jind	12
912	Kaithal	12
913	Kalanaur	12
914	Kalanwali	12
915	Kanina Khas	12
916	Karnal	12
917	Kharkhauda	12
918	Kheri Sampla	12
919	Kurukshetra	12
920	Ladwa	12
921	Loharu	12
922	Maham	12
923	Mahendragarh	12
924	Mandholi Kalan	12
925	Mustafabad	12
926	Narayangarh	12
927	Narnaul	12
928	Narnaund	12
929	Narwana	12
930	Nilokheri	12
931	Nuh	12
932	Palwal	12
933	Panchkula	12
934	Panipat	12
935	Pataudi	12
936	Pehowa	12
937	Pinjaur	12
938	Punahana	12
939	Pundri	12
940	Radaur	12
941	Rania	12
942	Ratia	12
943	Rewari	12
944	Rohtak	12
945	Safidon	12
946	Samalkha	12
947	Shadipur Julana	12
948	Shahabad	12
949	Sirsa	12
950	Sohna	12
951	Sonipat	12
952	Taoru	12
953	Thanesar	12
954	Tohana	12
955	Tosham	12
956	Uklana	12
957	Yamunanagar	12
958	Arki	13
959	Baddi	13
960	Banjar	13
961	Bilaspur	13
962	Chamba	13
963	Chaupal	13
964	Chowari	13
965	Chuari Khas	13
966	Dagshai	13
967	Dalhousie	13
968	Daulatpur	13
969	Dera Gopipur	13
970	Dharamsala	13
971	Gagret	13
972	Ghumarwin	13
973	Hamirpur	13
974	Jawala Mukhi	13
975	Jogindarnagar	13
976	Jubbal	13
977	Jutogh	13
978	Kalka	13
979	Kangar	13
980	Kangra	13
981	Kasauli	13
982	Kinnaur	13
983	Kotkhai	13
984	Kotla	13
985	Kulu	13
986	Kyelang	13
987	Lahul and Spiti	13
988	Manali	13
989	Mandi	13
990	Nadaun	13
991	Nagar	13
992	Nagrota	13
993	Nahan	13
994	Nalagarh	13
995	Palampur	13
996	Pandoh	13
997	Paonta Sahib	13
998	Parwanoo	13
999	Rajgarh	13
1000	Rampur	13
1001	Rohru	13
1002	Sabathu	13
1003	Santokhgarh	13
1004	Sarahan	13
1005	Sarka Ghat	13
1006	Seoni	13
1007	Shimla	13
1008	Sirmaur	13
1009	Solan	13
1010	Sundarnagar	13
1011	Theog	13
1012	Tira Sujanpur	13
1013	Una	13
1014	Yol	13
1015	Akhnur	14
1016	Anantnag	14
1017	Awantipur	14
1018	Badgam	14
1019	Bandipore	14
1020	Banihal	14
1021	Baramula	14
1022	Batoti	14
1023	Bhadarwah	14
1024	Bijbehara	14
1025	Bishnah	14
1026	Doda	14
1027	Ganderbal	14
1028	Gho Brahmanan de	14
1029	Hajan	14
1030	Hiranagar	14
1031	Jammu	14
1032	Jaurian	14
1033	Kathua	14
1034	Katra	14
1035	Khaur	14
1036	Kishtwar	14
1037	Kud	14
1038	Kulgam	14
1039	Kupwara	14
1040	Ladakh	14
1041	Magam	14
1042	Nawanshahr	14
1043	Noria	14
1044	Padam	14
1045	Pahlgam	14
1046	Parol	14
1047	Pattan	14
1048	Pulwama	14
1049	Punch	14
1050	Qazigund	14
1051	Rajaori	14
1052	Rajauri	14
1053	Ramban	14
1054	Ramgarh	14
1055	Ramnagar	14
1056	Riasi	14
1057	Samba	14
1058	Shupiyan	14
1059	Sopur	14
1060	Soyibug	14
1061	Srinagar	14
1062	Sumbal	14
1063	Thang	14
1064	Thanna Mandi	14
1065	Tral	14
1066	Tsrar Sharif	14
1067	Udhampur	14
1068	Uri	14
1069	Bagra	15
1070	Barka Kana	15
1071	Barki Saria	15
1072	Barwadih	15
1073	Bhojudih	15
1074	Bokaro	15
1075	Bundu	15
1076	Chaibasa	15
1077	Chakradharpur	15
1078	Chakulia	15
1079	Chandil	15
1080	Chas	15
1081	Chatra	15
1082	Chiria	15
1083	Daltonganj	15
1084	Deogarh	15
1085	Dhanbad	15
1086	Dhanwar	15
1087	Dugda	15
1088	Dumka	15
1089	Garhwa	15
1090	Ghatsila	15
1091	Giridih	15
1092	Gobindpur	15
1093	Godda	15
1094	Gomoh	15
1095	Gopinathpur	15
1096	Gua	15
1097	Gumia	15
1098	Gumla	15
1099	Hazaribag	15
1100	Hazaribagh	15
1101	Hesla	15
1102	Husainabad	15
1103	Jagannathpur	15
1104	Jamadoba	15
1105	Jamshedpur	15
1106	Jamtara	15
1107	Jasidih	15
1108	Jharia	15
1109	Jugsalai	15
1110	Jumri Tilaiya	15
1111	Kalikapur	15
1112	Kandra	15
1113	Kanke	15
1114	Katras	15
1115	Kenduadih	15
1116	Kharsawan	15
1117	Khunti	15
1118	Kodarma	15
1119	Kuju	15
1120	Latehar	15
1121	Lohardaga	15
1122	Madhupur	15
1123	Malkera	15
1124	Manoharpur	15
1125	Mugma	15
1126	Mushabani	15
1127	Neturhat	15
1128	Nirsa	15
1129	Noamundi	15
1130	Pakur	15
1131	Palamu	15
1132	Pashchim Singhbhum	15
1133	patamda	15
1134	Pathardih	15
1135	Purba Singhbhum	15
1136	Ramgarh	15
1137	Ranchi	15
1138	Ray	15
1139	Sahibganj	15
1140	Saraikela	15
1141	Sarubera	15
1142	Sijua	15
1143	Simdega	15
1144	Sini	15
1145	Topchanchi	15
1146	Afzalpur	16
1147	Ajjampur	16
1148	Aland	16
1149	Alnavar	16
1150	Alur	16
1151	Anekal	16
1152	Ankola	16
1153	Annigeri	16
1154	Arkalgud	16
1155	Arsikere	16
1156	Athni	16
1157	Aurad	16
1158	Badami	16
1159	Bagalkot	16
1160	Bagepalli	16
1161	Bail-Hongal	16
1162	Ballari	16
1163	Banavar	16
1164	Bangalore Rural	16
1165	Bangalore Urban	16
1166	Bangarapet	16
1167	Bannur	16
1168	Bantval	16
1169	Basavakalyan	16
1170	Basavana Bagevadi	16
1171	Belagavi	16
1172	Belluru	16
1173	Beltangadi	16
1174	Belur	16
1175	Bengaluru	16
1176	Bhadravati	16
1177	Bhalki	16
1178	Bhatkal	16
1179	Bidar	16
1180	Bilgi	16
1181	Birur	16
1182	Byadgi	16
1183	Byndoor	16
1184	Canacona	16
1185	Challakere	16
1186	Chamrajnagar	16
1187	Channagiri	16
1188	Channapatna	16
1189	Channarayapatna	16
1190	Chik Ballapur	16
1191	Chikkaballapur	16
1192	Chikkamagaluru	16
1193	Chiknayakanhalli	16
1194	Chikodi	16
1195	Chincholi	16
1196	Chintamani	16
1197	Chitapur	16
1198	Chitradurga	16
1199	Closepet	16
1200	Coondapoor	16
1201	Dakshina Kannada	16
1202	Dandeli	16
1203	Davanagere	16
1204	Devanhalli	16
1205	Dharwad	16
1206	Dod Ballapur	16
1207	French Rocks	16
1208	Gadag	16
1209	Gadag-Betageri	16
1210	Gajendragarh	16
1211	Gangawati	16
1212	Gangolli	16
1213	Gokak	16
1214	Gokarna	16
1215	Goribidnur	16
1216	Gorur	16
1217	Gubbi	16
1218	Gudibanda	16
1219	Guledagudda	16
1220	Gundlupet	16
1221	Gurmatkal	16
1222	Hadagalli	16
1223	Haliyal	16
1224	Hampi	16
1225	Hangal	16
1226	Harihar	16
1227	Harpanahalli	16
1228	Hassan	16
1229	Haveri	16
1230	Heggadadevankote	16
1231	Hirekerur	16
1232	Hiriyur	16
1233	Holalkere	16
1234	Hole Narsipur	16
1235	Homnabad	16
1236	Honavar	16
1237	Honnali	16
1238	Hosanagara	16
1239	Hosangadi	16
1240	Hosdurga	16
1241	Hoskote	16
1242	Hospet	16
1243	Hubballi	16
1244	Hukeri	16
1245	Hungund	16
1246	Hunsur	16
1247	Ilkal	16
1248	Indi	16
1249	Jagalur	16
1250	Jamkhandi	16
1251	Jevargi	16
1252	Kadur	16
1253	Kalaburgi	16
1254	Kalghatgi	16
1255	Kampli	16
1256	Kankanhalli	16
1257	Karkala	16
1258	Karwar	16
1259	Kavalur	16
1260	Kerur	16
1261	Khanapur	16
1262	Kodagu	16
1263	Kodigenahalli	16
1264	Kodlipet	16
1265	Kolar	16
1266	Kollegal	16
1267	Konanur	16
1268	Konnur	16
1269	Koppa	16
1270	Koppal	16
1271	Koratagere	16
1272	Kotturu	16
1273	Krishnarajpet	16
1274	Kudachi	16
1275	Kudligi	16
1276	Kumsi	16
1277	Kumta	16
1278	Kundgol	16
1279	Kunigal	16
1280	Kurgunta	16
1281	Kushalnagar	16
1282	Kushtagi	16
1283	Lakshmeshwar	16
1284	Lingsugur	16
1285	Londa	16
1286	Maddagiri	16
1287	Maddur	16
1288	Madikeri	16
1289	Magadi	16
1290	Mahalingpur	16
1291	Malavalli	16
1292	Malpe	16
1293	Malur	16
1294	Mandya	16
1295	Mangaluru	16
1296	Manipal	16
1297	Manvi	16
1298	Mayakonda	16
1299	Melukote	16
1300	Mudbidri	16
1301	Muddebihal	16
1302	Mudgal	16
1303	Mudgere	16
1304	Mudhol	16
1305	Mulbagal	16
1306	Mulgund	16
1307	Mulki	16
1308	Mundargi	16
1309	Mundgod	16
1310	Munirabad	16
1311	Murudeshwara	16
1312	Mysuru	16
1313	Nagamangala	16
1314	Nanjangud	16
1315	Narasimharajapura	16
1316	Naregal	16
1317	Nargund	16
1318	Navalgund	16
1319	Nelamangala	16
1320	Nyamti	16
1321	Pangala	16
1322	Pavugada	16
1323	Piriyapatna	16
1324	Ponnampet	16
1325	Puttur	16
1326	Rabkavi	16
1327	Raichur	16
1328	Ramanagara	16
1329	Ranibennur	16
1330	Raybag	16
1331	Robertsonpet	16
1332	Ron	16
1333	Sadalgi	16
1334	Sagar	16
1335	Sakleshpur	16
1336	Sandur	16
1337	Sanivarsante	16
1338	Sankeshwar	16
1339	Sargur	16
1340	Saundatti	16
1341	Savanur	16
1342	Seram	16
1343	Shahabad	16
1344	Shahpur	16
1345	Shiggaon	16
1346	Shikarpur	16
1347	Shimoga	16
1348	Shirhatti	16
1349	Shorapur	16
1350	Shrirangapattana	16
1351	Siddapur	16
1352	Sidlaghatta	16
1353	Sindgi	16
1354	Sindhnur	16
1355	Sira	16
1356	Sirsi	16
1357	Siruguppa	16
1358	Someshwar	16
1359	Somvarpet	16
1360	Sorab	16
1361	Sravana Belgola	16
1362	Sringeri	16
1363	Srinivaspur	16
1364	Sulya	16
1365	Suntikoppa	16
1366	Talikota	16
1367	Tarikere	16
1368	Tekkalakote	16
1369	Terdal	16
1370	Tiptur	16
1371	Tirthahalli	16
1372	Tirumakudal Narsipur	16
1373	Tumakuru	16
1374	Turuvekere	16
1375	Udupi	16
1376	Ullal	16
1377	Uttar Kannada	16
1378	Vadigenhalli	16
1379	Vijayapura	16
1380	Virarajendrapet	16
1381	Wadi	16
1382	Yadgir	16
1383	Yelahanka	16
1384	Yelandur	16
1385	Yelbarga	16
1386	Yellapur	16
1387	Adur	17
1388	Alappuzha	17
1389	Aluva	17
1390	Alwaye	17
1391	Angamali	17
1392	Aroor	17
1393	Arukutti	17
1394	Attingal	17
1395	Avanoor	17
1396	Azhikkal	17
1397	Beypore	17
1398	Changanacheri	17
1399	Chelakara	17
1400	Chengannur	17
1401	Cherpulassery	17
1402	Cherthala	17
1403	Chetwayi	17
1404	Chittur	17
1405	Cochin	17
1406	Dharmadom	17
1407	Edakkulam	17
1408	Elur	17
1409	Erattupetta	17
1410	Ernakulam	17
1411	Ferokh	17
1412	Guruvayur	17
1413	Idukki	17
1414	Iringal	17
1415	Irinjalakuda	17
1416	Kadakkavoor	17
1417	Kalamassery	17
1418	Kalavoor	17
1419	Kalpetta	17
1420	Kanhangad	17
1421	Kannavam	17
1422	Kannur	17
1423	Kasaragod	17
1424	Kattanam	17
1425	Kayankulam	17
1426	Kizhake Chalakudi	17
1427	Kodungallur	17
1428	Kollam	17
1429	Kotamangalam	17
1430	Kottayam	17
1431	Kovalam	17
1432	Kozhikode	17
1433	Kumbalam	17
1434	Kunnamangalam	17
1435	Kunnamkulam	17
1436	Kunnumma	17
1437	Kutiatodu	17
1438	Kuttampuzha	17
1439	Lalam	17
1440	Mahe	17
1441	Malappuram	17
1442	Manjeri	17
1443	Manjeshwaram	17
1444	Mannarakkat	17
1445	Marayur	17
1446	Mattanur	17
1447	Mavelikara	17
1448	Mavoor	17
1449	Muluppilagadu	17
1450	Munnar	17
1451	Muvattupula	17
1452	Muvattupuzha	17
1453	Nadapuram	17
1454	Naduvannur	17
1455	Nedumangad	17
1456	Neyyattinkara	17
1457	Nileshwar	17
1458	Ottappalam	17
1459	Palackattumala	17
1460	Palakkad district	17
1461	Palghat	17
1462	Panamaram	17
1463	Pappinissheri	17
1464	Paravur Tekkumbhagam	17
1465	Pariyapuram	17
1466	Pathanamthitta	17
1467	Pattanamtitta	17
1468	Payyanur	17
1469	Perinthalmanna	17
1470	Perumbavoor	17
1471	Perumpavur	17
1472	Perya	17
1473	Piravam	17
1474	Ponmana	17
1475	Ponnani	17
1476	Punalur	17
1477	Ramamangalam	17
1478	Sharanur	17
1479	Shertallai	17
1480	Taliparamba	17
1481	Thalassery	17
1482	Thanniyam	17
1483	Thiruvananthapuram	17
1484	Thrissur	17
1485	Tirur	17
1486	Tiruvalla	17
1487	Vaikam	17
1488	Varkala	17
1489	Vatakara	17
1490	Vayalar	17
1491	Vettur	17
1492	Wayanad	17
1493	Kargil	18
1494	Leh	18
1495	Kavaratti	19
1496	Lakshadweep	19
1497	Agar	20
1498	Ajaigarh	20
1499	Akodia	20
1500	Alampur	20
1501	Alirajpur	20
1502	Alot	20
1503	Amanganj	20
1504	Amarkantak	20
1505	Amarpatan	20
1506	Amarwara	20
1507	Ambah	20
1508	Amla	20
1509	Anjad	20
1510	Antri	20
1511	Anuppur	20
1512	Aron	20
1513	Ashoknagar	20
1514	Ashta	20
1515	Babai	20
1516	Badarwas	20
1517	Badnawar	20
1518	Bagh	20
1519	Bagli	20
1520	Baihar	20
1521	Baikunthpur	20
1522	Bakshwaha	20
1523	Balaghat	20
1524	Baldeogarh	20
1525	Bamna	20
1526	Bamor Kalan	20
1527	Bamora	20
1528	Banda	20
1529	Barela	20
1530	Barghat	20
1531	Bargi	20
1532	Barhi	20
1533	Barwani	20
1534	Basoda	20
1535	Begamganj	20
1536	Beohari	20
1537	Berasia	20
1538	Betma	20
1539	Betul	20
1540	Betul Bazar	20
1541	Bhabhra	20
1542	Bhainsdehi	20
1543	Bhander	20
1544	Bhanpura	20
1545	Bhawaniganj	20
1546	Bhikangaon	20
1547	Bhind	20
1548	Bhitarwar	20
1549	Bhopal	20
1550	Biaora	20
1551	Bijawar	20
1552	Bijrauni	20
1553	Bodri	20
1554	Burhanpur	20
1555	Burhar	20
1556	Chanderi	20
1557	Chandia	20
1558	Chandla	20
1559	Chhatarpur	20
1560	Chhindwara	20
1561	Chichli	20
1562	Chorhat	20
1563	Daboh	20
1564	Dabra	20
1565	Damoh	20
1566	Datia	20
1567	Deori Khas	20
1568	Depalpur	20
1569	Dewas	20
1570	Dhamnod	20
1571	Dhana	20
1572	Dhar	20
1573	Dharampuri	20
1574	Dindori	20
1575	Etawa	20
1576	Gadarwara	20
1577	Garha Brahman	20
1578	Garhakota	20
1579	Gautampura	20
1580	Ghansor	20
1581	Gogapur	20
1582	Gohadi	20
1583	Govindgarh	20
1584	Guna	20
1585	Gurh	20
1586	Gwalior	20
1587	Harda	20
1588	Harda Khas	20
1589	Harpalpur	20
1590	Harrai	20
1591	Harsud	20
1592	Hatod	20
1593	Hatta	20
1594	Hindoria	20
1595	Hoshangabad	20
1596	Iawar	20
1597	Ichhawar	20
1598	Iklehra	20
1599	Indore	20
1600	Isagarh	20
1601	Itarsi	20
1602	Jabalpur	20
1603	Jaisinghnagar	20
1604	Jaithari	20
1605	Jamai	20
1606	Jaora	20
1607	Jatara	20
1608	Jawad	20
1609	Jhabua	20
1610	Jiran	20
1611	Jobat	20
1612	Kailaras	20
1613	Kaimori	20
1614	Kannod	20
1615	Kareli	20
1616	Karera	20
1617	Karrapur	20
1618	Kasrawad	20
1619	Katangi	20
1620	Katni	20
1621	Khachrod	20
1622	Khailar	20
1623	Khajuraho Group of Monuments	20
1624	Khamaria	20
1625	Khandwa	20
1626	Khargapur	20
1627	Khargone	20
1628	Khategaon	20
1629	Khilchipur	20
1630	Khirkiyan	20
1631	Khujner	20
1632	Khurai	20
1633	Kolaras	20
1634	Korwai	20
1635	Kotar	20
1636	Kothi	20
1637	Kotma	20
1638	Kotwa	20
1639	Kukshi	20
1640	Kumbhraj	20
1641	Lahar	20
1642	Lakhnadon	20
1643	Leteri	20
1644	Lodhikheda	20
1645	Machalpur	20
1646	Madhogarh	20
1647	Maheshwar	20
1648	Mahgawan	20
1649	Maihar	20
1650	Majholi	20
1651	Maksi	20
1652	Malhargarh	20
1653	Manasa	20
1654	Manawar	20
1655	Mandideep	20
1656	Mandla	20
1657	Mandleshwar	20
1658	Mandsaur	20
1659	Mangawan	20
1660	Manpur	20
1661	Mau	20
1662	Mauganj	20
1663	Mihona	20
1664	Mohgaon	20
1665	Morar	20
1666	Morena	20
1667	Multai	20
1668	Mundi	20
1669	Mungaoli	20
1670	Murwara	20
1671	Nagda	20
1672	Nagod	20
1673	Naigarhi	20
1674	Nainpur	20
1675	Namli	20
1676	Naraini	20
1677	Narayangarh	20
1678	Narsimhapur	20
1679	Narsinghgarh	20
1680	Narwar	20
1681	Nasrullahganj	20
1682	Neemuch	20
1683	Nepanagar	20
1684	Orchha	20
1685	Pachmarhi	20
1686	Palera	20
1687	Pali	20
1688	Panagar	20
1689	Panara	20
1690	Pandhana	20
1691	Pandhurna	20
1692	Panna	20
1693	Pansemal	20
1694	Parasia	20
1695	Patan	20
1696	Patharia	20
1697	Pawai	20
1698	Petlawad	20
1699	Piploda	20
1700	Pithampur	20
1701	Porsa	20
1702	Punasa	20
1703	Raghogarh	20
1704	Rahatgarh	20
1705	Raisen	20
1706	Rajgarh	20
1707	Rajnagar	20
1708	Rajpur	20
1709	Rampura	20
1710	Ranapur	20
1711	Ratangarh	20
1712	Ratlam	20
1713	Rehli	20
1714	Rehti	20
1715	Rewa	20
1716	Sabalgarh	20
1717	Sagar	20
1718	Sailana	20
1719	Sanawad	20
1720	Sanchi	20
1721	Sanwer	20
1722	Sarangpur	20
1723	Satna	20
1724	Satwas	20
1725	Saugor	20
1726	Sausar	20
1727	Sehore	20
1728	Sendhwa	20
1729	Seondha	20
1730	Seoni	20
1731	Seoni Malwa	20
1732	Shahdol	20
1733	Shahgarh	20
1734	Shahpur	20
1735	Shahpura	20
1736	Shajapur	20
1737	Shamgarh	20
1738	Sheopur	20
1739	Shivpuri	20
1740	Shujalpur	20
1741	Sidhi	20
1742	Sihora	20
1743	Simaria	20
1744	Singoli	20
1745	Singrauli	20
1746	Sirmaur	20
1747	Sironj	20
1748	Sitamau	20
1749	Sohagi	20
1750	Sohagpur	20
1751	Sultanpur	20
1752	Susner	20
1753	Tal	20
1754	Talen	20
1755	Tarana	20
1756	Tekanpur	20
1757	Tendukheda	20
1758	Teonthar	20
1759	Thandla	20
1760	Tikamgarh	20
1761	Tirodi	20
1762	Udaipura	20
1763	Ujjain	20
1764	Ukwa	20
1765	Umaria	20
1766	Umri	20
1767	Unhel	20
1768	Vidisha	20
1769	Waraseoni	20
1770	Achalpur	21
1771	Adawad	21
1772	Agar Panchaitan	21
1773	Aheri	21
1774	Ahmadpur	21
1775	Ahmednagar	21
1776	Airoli	21
1777	Ajara	21
1778	Akalkot	21
1779	Akluj	21
1780	Akola	21
1781	Akolner	21
1782	Akot	21
1783	Akrani	21
1784	Alandi	21
1785	Ale	21
1786	Alibag	21
1787	Alkuti	21
1788	Allapalli	21
1789	Amalner	21
1790	Amarnath	21
1791	Ambad	21
1792	Ambajogai	21
1793	Ambegaon	21
1794	Ambernath	21
1795	Amgaon	21
1796	Amravati	21
1797	Andheri	21
1798	Andura	21
1799	Anjangaon	21
1800	Anjarle	21
1801	Anshing	21
1802	Arag	21
1803	Arangaon	21
1804	Ardhapur	21
1805	Argaon	21
1806	Artist Village	21
1807	Arvi	21
1808	Ashta	21
1809	Ashti	21
1810	Asoda	21
1811	Assaye	21
1812	Astagaon	21
1813	Aundh Satara	21
1814	Aurangabad	21
1815	Ausa	21
1816	Badlapur	21
1817	Badnapur	21
1818	Badnera	21
1819	Bagewadi	21
1820	Balapur	21
1821	Balapur Akola district	21
1822	Ballalpur	21
1823	Ballard Estate	21
1824	Ballarpur	21
1825	Banda Maharashtra	21
1826	Bandra	21
1827	Baner	21
1828	Bankot	21
1829	Baramati	21
1830	Barsi	21
1831	Basmat	21
1832	Bavdhan	21
1833	Bawanbir	21
1834	Beed	21
1835	Bhadgaon Maharashtra	21
1836	Bhandara	21
1837	Bhandardara	21
1838	Bhandup	21
1839	Bhayandar	21
1840	Bhigvan	21
1841	Bhiwandi	21
1842	Bhiwapur	21
1843	Bhokar	21
1844	Bhokardan	21
1845	Bhoom	21
1846	Bhor	21
1847	Bhudgaon	21
1848	Bhugaon	21
1849	Bhusaval	21
1850	Bijur	21
1851	Bilashi	21
1852	Biloli	21
1853	Boisar	21
1854	Borgaon Manju	21
1855	Borivali	21
1856	Brahmapuri	21
1857	Breach Candy	21
1858	Buldana	21
1859	Byculla	21
1860	Chakan	21
1861	Chakur	21
1862	Chalisgaon	21
1863	Chanda	21
1864	Chandgad	21
1865	Chandor	21
1866	Chandrapur	21
1867	Chandur	21
1868	Chandur Bazar	21
1869	Chausala	21
1870	Chembur	21
1871	Chicholi	21
1872	Chichondi Patil	21
1873	Chikhli (Buldhana)	21
1874	Chikhli (Jalna)	21
1875	Chimur	21
1876	Chinchani	21
1877	Chinchpokli	21
1878	Chiplun	21
1879	Chopda	21
1880	Colaba	21
1881	Dabhol	21
1882	Daddi	21
1883	Dahanu	21
1884	Dahivel	21
1885	Dapoli	21
1886	Darwha	21
1887	Daryapur	21
1888	Dattapur	21
1889	Daulatabad	21
1890	Daund	21
1891	Deccan Gymkhana	21
1892	Deglur	21
1893	Dehu	21
1894	Deolali	21
1895	Deolapar	21
1896	Deoli	21
1897	Deoni	21
1898	Deulgaon Raja	21
1899	Devrukh	21
1900	Dharangaon	21
1901	Dharavi	21
1902	Dharmabad	21
1903	Dharur	21
1904	Dhawalpuri	21
1905	Dhule	21
1906	Dhulia	21
1907	Dighori	21
1908	Diglur	21
1909	Digras	21
1910	Dindori Maharashtra	21
1911	Diveagar	21
1912	Dombivli	21
1913	Dondaicha	21
1914	Dongri	21
1915	Dudhani	21
1916	Durgapur	21
1917	Durgapur Chandrapur	21
1918	Erandol	21
1919	Faizpur	21
1920	Fort	21
1921	Gadchiroli	21
1922	Gadhinglaj	21
1923	Gangakher	21
1924	Gangapur	21
1925	Ganpatipule	21
1926	Gevrai	21
1927	Ghargaon	21
1928	Ghatanji	21
1929	Ghatkopar	21
1930	Ghoti Budrukh	21
1931	Ghugus	21
1932	Girgaon	21
1933	Gondia	21
1934	Gorai	21
1935	Goregaon	21
1936	Guhagar	21
1937	Hadapsar Pune	21
1938	Hadgaon	21
1939	Halkarni	21
1940	Harangul	21
1941	Harnai	21
1942	Helwak	21
1943	Hinganghat	21
1944	Hingoli	21
1945	Hirapur	21
1946	Hirapur Hamesha	21
1947	Hotgi	21
1948	Ichalkaranji	21
1949	Igatpuri	21
1950	Indapur	21
1951	Jaisingpur	21
1952	Jaitapur	21
1953	Jakhangaon	21
1954	Jalgaon	21
1955	Jalgaon Jamod	21
1956	Jalkot	21
1957	Jalna	21
1958	Jamkhed	21
1959	Jamod	21
1960	Janephal	21
1961	Jaoli	21
1962	Jat Sangli	21
1963	Jategaon	21
1964	Jawhar	21
1965	Jaysingpur	21
1966	Jejuri	21
1967	Jintur	21
1968	Jogeshwari	21
1969	Juhu	21
1970	Junnar	21
1971	Kachurwahi	21
1972	Kadegaon	21
1973	Kadus	21
1974	Kagal	21
1975	Kaij	21
1976	Kalamb	21
1977	Kalamb Osmanabad	21
1978	Kalamboli	21
1979	Kalamnuri	21
1980	Kalas	21
1981	Kali(DK)	21
1982	Kalmeshwar	21
1983	Kalundri	21
1984	Kalyan	21
1985	Kalyani Nagar	21
1986	Kamargaon	21
1987	Kamatgi	21
1988	Kamptee	21
1989	Kandri	21
1990	Kankauli	21
1991	Kankavli	21
1992	Kannad	21
1993	Karad	21
1994	Karajagi	21
1995	Karanja	21
1996	Karanja Lad	21
1997	Karjat	21
1998	Karkamb	21
1999	Karmala	21
2000	Kasara	21
2001	Kasoda	21
2002	Kati	21
2003	Katol	21
2004	Katral	21
2005	Khadki	21
2006	Khalapur	21
2007	Khallar	21
2008	Khamgaon	21
2009	Khanapur	21
2010	Khandala	21
2011	Khangaon	21
2012	Khapa	21
2013	Kharakvasla	21
2014	Kharda	21
2015	Kharghar	21
2016	Kharsundi	21
2017	Khed	21
2018	Khetia	21
2019	Khoni	21
2020	Khopoli	21
2021	Khuldabad	21
2022	Kinwat	21
2023	Kodoli	21
2024	Kolhapur	21
2025	Kondalwadi	21
2026	Kondhali	21
2027	Kopar Khairane	21
2028	Kopargaon	21
2029	Kopela	21
2030	Koradi	21
2031	Koregaon	21
2032	Koynanagar	21
2033	Kudal	21
2034	Kuhi	21
2035	Kurandvad	21
2036	Kurankhed	21
2037	Kurduvadi	21
2038	Kusumba	21
2039	Lakhandur	21
2040	Lanja	21
2041	Lasalgaon	21
2042	Latur	21
2043	Lavasa	21
2044	Lohogaon	21
2045	Lonar	21
2046	Lonavla	21
2047	Mahabaleshwar	21
2048	Mahad	21
2049	Mahape	21
2050	Mahim	21
2051	Maindargi	21
2052	Majalgaon	21
2053	Makhjan	21
2054	Malabar Hill	21
2055	Malad	21
2056	Malegaon	21
2057	Malkapur	21
2058	Malvan	21
2059	Manchar	21
2060	Mandangad	21
2061	Mandhal	21
2062	Mandwa	21
2063	Mangaon	21
2064	Mangrul Pir	21
2065	Manjlegaon	21
2066	Mankeshwar	21
2067	Mankhurd	21
2068	Manmad	21
2069	Manor	21
2070	Mansar	21
2071	Manwat	21
2072	Maregaon	21
2073	Mastiholi	21
2074	Masur India	21
2075	Matheran	21
2076	Matunga	21
2077	Mazagaon	21
2078	Mehekar	21
2079	Mehergaon	21
2080	Mehkar	21
2081	Mhasla	21
2082	Mhasvad	21
2083	Miraj	21
2084	Mohadi	21
2085	Mohol	21
2086	Mohpa	21
2087	Mokhada taluka	21
2088	Mora Maharashtra	21
2089	Moram	21
2090	Morsi	21
2091	Mowad	21
2092	Mudkhed	21
2093	Mukher	21
2094	Mul	21
2095	Mulher	21
2096	Mulund	21
2097	Mumbai	21
2098	Mumbai Suburban	21
2099	Murbad	21
2100	Murgud	21
2101	Murtajapur	21
2102	Murud (Raigad)	21
2103	Murud (Ratnagiri)	21
2104	Murum	21
2105	Nadgaon	21
2106	Nagapur	21
2107	Nagothana	21
2108	Nagpur	21
2109	Nagpur Division	21
2110	Nala Sopara	21
2111	Naldurg	21
2112	Nalegaon	21
2113	Nampur	21
2114	Nanded	21
2115	Nandgaon	21
2116	Nandnee	21
2117	Nandura	21
2118	Nandura Buzurg	21
2119	Nandurbar	21
2120	Narayangaon	21
2121	Nardana	21
2122	Nariman Point	21
2123	Narkhed	21
2124	Nashik	21
2125	Nashik Division	21
2126	Navapur	21
2127	Navi Mumbai	21
2128	Neral	21
2129	Nerur	21
2130	Nevasa	21
2131	Nighoj	21
2132	Nilanga	21
2133	Nipani	21
2134	Niphad	21
2135	Nira Narsingpur	21
2136	Osmanabad	21
2137	Ozar	21
2138	Pabal	21
2139	Pachora	21
2140	Pahur Maharashtra	21
2141	Paithan	21
2142	Palghar	21
2143	Pali Raigad	21
2144	Palso	21
2145	Panchgani	21
2146	Pandharpur	21
2147	Pandhurli	21
2148	Panhala	21
2149	Panvel	21
2150	Parbhani	21
2151	Parel	21
2152	Parli Vaijnath	21
2153	Parner	21
2154	Parola	21
2155	Parseoni	21
2156	Partur	21
2157	Patan	21
2158	Pathardi	21
2159	Pathri	21
2160	Patur	21
2161	Paturda	21
2162	Paud	21
2163	Pauni	21
2164	Pawni	21
2165	Pedgaon	21
2166	Peint	21
2167	Pen	21
2168	Phaltan	21
2169	Phulambri	21
2170	Piliv	21
2171	Pimpalgaon Baswant	21
2172	Pimpalgaon Raja	21
2173	Pimpri	21
2174	Pimpri-Chinchwad	21
2175	Pipri	21
2176	Powai	21
2177	Prabhadevi	21
2178	Prakasha	21
2179	Pulgaon	21
2180	Pune	21
2181	Pune Division	21
2182	Puntamba	21
2183	Pural	21
2184	Purna	21
2185	Pusad	21
2186	Radhanagari	21
2187	Rahata	21
2188	Rahimatpur	21
2189	Rahuri	21
2190	Raigarh	21
2191	Raireshwar	21
2192	Rajapur	21
2193	Rajgurunagar	21
2194	Rajur	21
2195	Rajura	21
2196	Ralegaon	21
2197	Ramewadi	21
2198	Ramtek	21
2199	Ratnagiri	21
2200	Raver	21
2201	Renapur	21
2202	Renavi	21
2203	Revadanda	21
2204	Revdanda	21
2205	Risod	21
2206	Roha	21
2207	Sailu	21
2208	Sakol	21
2209	Sakoli	21
2210	Sakri	21
2211	Samudrapur	21
2212	Sangameshwar	21
2213	Sangamner	21
2214	Sangli	21
2215	Sangola	21
2216	Sangrampur Maharashtra	21
2217	Saoli	21
2218	Saoner	21
2219	Sarangkheda	21
2220	Saswad	21
2221	Satana	21
2222	Satara	21
2223	Satara Division	21
2224	Satpati	21
2225	Savantvadi	21
2226	Savda	21
2227	Savlaj	21
2228	Sawantvadi	21
2229	Selu	21
2230	Sevagram	21
2231	Sewri	21
2232	Shahada	21
2233	Shahapur	21
2234	Shedbal	21
2235	Shegaon	21
2236	Shevgaon	21
2237	Shikrapur	21
2238	Shiraguppi	21
2239	Shirala	21
2240	Shirdi	21
2241	Shirgaon	21
2242	Shirol	21
2243	Shirpur	21
2244	Shirud	21
2245	Shirwal	21
2246	Shivaji Nagar	21
2247	Shrigonda	21
2248	Sillod	21
2249	Sindewahi	21
2250	Sindhudurg	21
2251	Sindi	21
2252	Sindkheda	21
2253	Sinnar	21
2254	Sion Mumbai	21
2255	Sironcha	21
2256	Sirur	21
2257	Sivala East Godavari district	21
2258	Solapur	21
2259	Sonala	21
2260	Sonegaon	21
2261	Songir	21
2262	Sonvad	21
2263	Soygaon	21
2264	Srivardhan	21
2265	Surgana	21
2266	Taklibhan	21
2267	Talbid	21
2268	Talegaon Dabhade	21
2269	Talegaon Dhamdhere	21
2270	Taloda	21
2271	Talode	21
2272	Tarapur	21
2273	Tardeo	21
2274	Tasgaon	21
2275	Telhara	21
2276	Thalner	21
2277	Thane	21
2278	Trimbak	21
2279	Trombay	21
2280	Tuljapur	21
2281	Tumsar	21
2282	Udgir	21
2283	Ulhasnagar	21
2284	Umarga	21
2285	Umarkhed	21
2286	Umred	21
2287	Uran	21
2288	Uruli Kanchan	21
2289	Vada	21
2290	Vadgaon	21
2291	Vadner	21
2292	Vaijapur	21
2293	Vairag	21
2294	Valsang	21
2295	Vangaon	21
2296	Varangaon	21
2297	Vashi	21
2298	Vasind	21
2299	Vatul	21
2300	Velas Maharashtra	21
2301	Velneshwar	21
2302	Vengurla	21
2303	Vijaydurg	21
2304	Vikhroli	21
2305	Vile Parle	21
2306	Vinchur	21
2307	Virar	21
2308	Vita Maharashtra	21
2309	Vite	21
2310	Wadala	21
2311	Wadgaon	21
2312	Wadner	21
2313	Wadwani	21
2314	Wagholi	21
2315	Wai	21
2316	Wakad	21
2317	Walgaon	21
2318	Walki	21
2319	Wani	21
2320	Wardha	21
2321	Warora	21
2322	Warud	21
2323	Washim	21
2324	Worli	21
2325	Yaval	21
2326	Yavatmal	21
2327	Yeola	21
2328	Bishnupur	22
2329	Chandel	22
2330	Churachandpur	22
2331	Imphal East	22
2332	Imphal West	22
2333	Jiribam	22
2334	Kakching	22
2335	Kamjong	22
2336	Kangpokpi	22
2337	Noney	22
2338	Pherzawl	22
2339	Senapati	22
2340	Tamenglong	22
2341	Tengnoupal	22
2342	Thoubal	22
2343	Ukhrul	22
2344	Cherrapunji	23
2345	East Garo Hills	23
2346	East Jaintia Hills	23
2347	East Khasi Hills	23
2348	Mairang	23
2349	Mankachar	23
2350	Nongpoh	23
2351	Nongstoin	23
2352	North Garo Hills	23
2353	Ri-Bhoi	23
2354	Shillong	23
2355	South Garo Hills	23
2356	South West Garo Hills	23
2357	South West Khasi Hills	23
2358	Tura	23
2359	West Garo Hills	23
2360	West Jaintia Hills	23
2361	West Khasi Hills	23
2362	Aizawl	24
2363	Champhai	24
2364	Darlawn	24
2365	Khawhai	24
2366	Kolasib	24
2367	Lawngtlai	24
2368	Lunglei	24
2369	Mamit	24
2370	North Vanlaiphai	24
2371	Saiha	24
2372	Sairang	24
2373	Saitlaw	24
2374	Serchhip	24
2375	Thenzawl	24
2376	Dimapur	25
2377	Kohima	25
2378	Mokokchung	25
2379	Mon	25
2380	Peren	25
2381	Phek	25
2382	Tuensang	25
2383	Tuensang District	25
2384	Wokha	25
2385	Zunheboto	25
2386	Angul	26
2387	Angul District	26
2388	Asika	26
2389	Athagarh	26
2390	Bada Barabil	26
2391	Balangir	26
2392	Balasore	26
2393	Baleshwar	26
2394	Balimila	26
2395	Balugaon	26
2396	Banapur	26
2397	Banki	26
2398	Banposh	26
2399	Baragarh	26
2400	Barbil	26
2401	Bargarh	26
2402	Barpali	26
2403	Basudebpur	26
2404	Baud	26
2405	Baudh	26
2406	Belaguntha	26
2407	Bhadrak	26
2408	Bhadrakh	26
2409	Bhanjanagar	26
2410	Bhawanipatna	26
2411	Bhuban	26
2412	Bhubaneswar	26
2413	Binka	26
2414	Birmitrapur	26
2415	Bolanikhodan	26
2416	Brahmapur	26
2417	Brajarajnagar	26
2418	Buguda	26
2419	Burla	26
2420	Champua	26
2421	Chandbali	26
2422	Chatrapur	26
2423	Chikitigarh	26
2424	Chittarkonda	26
2425	Cuttack	26
2426	Daitari	26
2427	Deogarh	26
2428	Dhenkanal	26
2429	Digapahandi	26
2430	Gajapati	26
2431	Ganjam	26
2432	Gopalpur	26
2433	Gudari	26
2434	Gunupur	26
2435	Hinjilikatu	26
2436	Hirakud	26
2437	Jagatsinghpur	26
2438	Jajpur	26
2439	Jaleshwar	26
2440	Jatani	26
2441	Jeypore	26
2442	Jharsuguda	26
2443	Jharsuguda District	26
2444	Kaintragarh	26
2445	Kalahandi	26
2446	Kamakhyanagar	26
2447	Kandhamal	26
2448	Kantabanji	26
2449	Kantilo	26
2450	Kendrapara	26
2451	Kendujhar	26
2452	Kesinga	26
2453	Khallikot	26
2454	Kharhial	26
2455	Khordha	26
2456	Khurda	26
2457	Kiri Buru	26
2458	Kodala	26
2459	Konarka	26
2460	Koraput	26
2461	Kuchaiburi	26
2462	Kuchinda	26
2463	Malkangiri	26
2464	Mayurbhanj	26
2465	Nabarangpur	26
2466	Nayagarh	26
2467	Nayagarh District	26
2468	Nilgiri	26
2469	Nimaparha	26
2470	Nowrangapur	26
2471	Nuapada	26
2472	Padampur	26
2473	Paradip Garh	26
2474	Patamundai	26
2475	Patnagarh	26
2476	Phulbani	26
2477	Pipili	26
2478	Polasara	26
2479	Puri	26
2480	Purushottampur	26
2481	Rambha	26
2482	Raurkela	26
2483	Rayagada	26
2484	Remuna	26
2485	Rengali	26
2486	Sambalpur	26
2487	Sonepur	26
2488	Sorada	26
2489	Soro	26
2490	Subarnapur	26
2491	Sundargarh	26
2492	Talcher	26
2493	Tarabha	26
2494	Titlagarh	26
2495	Udayagiri	26
2496	Karaikal	27
2497	Mahe	27
2498	Puducherry	27
2499	Yanam	27
2500	Abohar	28
2501	Adampur	28
2502	Ajitgarh	28
2503	Ajnala	28
2504	Akalgarh	28
2505	Alawalpur	28
2506	Amloh	28
2507	Amritsar	28
2508	Anandpur Sahib	28
2509	Badhni Kalan	28
2510	Bagha Purana	28
2511	Bakloh	28
2512	Balachor	28
2513	Banga	28
2514	Banur	28
2515	Barnala	28
2516	Batala	28
2517	Begowal	28
2518	Bhadaur	28
2519	Bhatinda	28
2520	Bhawanigarh	28
2521	Bhikhi	28
2522	Bhogpur	28
2523	Bholath	28
2524	Budhlada	28
2525	Chima	28
2526	Dasuya	28
2527	Dera Baba Nanak	28
2528	Dera Bassi	28
2529	Dhanaula	28
2530	Dhariwal	28
2531	Dhilwan	28
2532	Dhudi	28
2533	Dhuri	28
2534	Dina Nagar	28
2535	Dirba	28
2536	Doraha	28
2537	Faridkot	28
2538	Fatehgarh Churian	28
2539	Fatehgarh Sahib	28
2540	Fazilka	28
2541	Firozpur	28
2542	Firozpur District	28
2543	Gardhiwala	28
2544	Garhshankar	28
2545	Ghanaur	28
2546	Giddarbaha	28
2547	Gurdaspur	28
2548	Guru Har Sahai	28
2549	Hajipur	28
2550	Hariana	28
2551	Hoshiarpur	28
2552	Ishanpur	28
2553	Jagraon	28
2554	Jaito	28
2555	Jalalabad	28
2556	Jalandhar	28
2557	Jandiala	28
2558	Jandiala Guru	28
2559	Kalanaur	28
2560	Kapurthala	28
2561	Kartarpur	28
2562	Khamanon	28
2563	Khanna	28
2564	Kharar	28
2565	Khemkaran	28
2566	Kot Isa Khan	28
2567	Kotkapura	28
2568	Laungowal	28
2569	Ludhiana	28
2570	Machhiwara	28
2571	Majitha	28
2572	Makhu	28
2573	Malaut	28
2574	Malerkotla	28
2575	Mansa	28
2576	Maur Mandi	28
2577	Moga	28
2578	Mohali	28
2579	Morinda	28
2580	Mukerian	28
2581	Nabha	28
2582	Nakodar	28
2583	Nangal	28
2584	Nawanshahr	28
2585	Nurmahal	28
2586	Nurpur Kalan	28
2587	Pathankot	28
2588	Patiala	28
2589	Patti	28
2590	Phagwara	28
2591	Phillaur	28
2592	Qadian	28
2593	Rahon	28
2594	Raikot	28
2595	Rajasansi	28
2596	Rajpura	28
2597	Ram Das	28
2598	Rampura	28
2599	Rupnagar	28
2600	Samrala	28
2601	Sanaur	28
2602	Sangrur	28
2603	Sardulgarh	28
2604	Shahid Bhagat Singh Nagar	28
2605	Shahkot	28
2606	Sham Churasi	28
2607	Sirhind-Fategarh	28
2608	Sri Muktsar Sahib	28
2609	Sultanpur Lodhi	28
2610	Sunam	28
2611	Talwandi Bhai	28
2612	Talwara	28
2613	Tarn Taran Sahib	28
2614	Zira	28
2615	Abhaneri	29
2616	Abu	29
2617	Abu Road	29
2618	Ajmer	29
2619	Aklera	29
2620	Alwar	29
2621	Amet	29
2622	Anta	29
2623	Anupgarh	29
2624	Asind	29
2625	Bagar	29
2626	Bakani	29
2627	Bali	29
2628	Balotra	29
2629	Bandikui	29
2630	Banswara	29
2631	Baran	29
2632	Bari	29
2633	Bari Sadri	29
2634	Barmer	29
2635	Basi	29
2636	Basni	29
2637	Baswa	29
2638	Bayana	29
2639	Beawar	29
2640	Begun	29
2641	Behror	29
2642	Bhadasar	29
2643	Bhadra	29
2644	Bharatpur	29
2645	Bhasawar	29
2646	Bhilwara	29
2647	Bhindar	29
2648	Bhinmal	29
2649	Bhiwadi	29
2650	Bhuma	29
2651	Bikaner	29
2652	Bilara	29
2653	Bissau	29
2654	Borkhera	29
2655	Bundi	29
2656	Chaksu	29
2657	Chechat	29
2658	Chhabra	29
2659	Chhapar	29
2660	Chhoti Sadri	29
2661	Chidawa	29
2662	Chittaurgarh	29
2663	Churu	29
2664	Dariba	29
2665	Dausa	29
2666	Deoli	29
2667	Deshnoke	29
2668	Devgarh	29
2669	Dhaulpur	29
2670	Didwana	29
2671	Dig	29
2672	Dungarpur	29
2673	Fatehpur	29
2674	Galiakot	29
2675	Ganganagar	29
2676	Gangapur	29
2677	Govindgarh	29
2678	Gulabpura	29
2679	Hanumangarh	29
2680	Hindaun	29
2681	Jahazpur	29
2682	Jaipur	29
2683	Jaisalmer	29
2684	Jaitaran	29
2685	Jalor	29
2686	Jalore	29
2687	Jhalawar	29
2688	Jhalrapatan	29
2689	Jhunjhunun	29
2690	Jobner	29
2691	Jodhpur	29
2692	Kaman	29
2693	Kanor	29
2694	Kapren	29
2695	Karanpur	29
2696	Karauli	29
2697	Kekri	29
2698	Keshorai Patan	29
2699	Khandela	29
2700	Khanpur	29
2701	Khetri	29
2702	Kishangarh	29
2703	Kota	29
2704	Kotputli	29
2705	Kuchaman	29
2706	Kuchera	29
2707	Kumher	29
2708	Kushalgarh	29
2709	Lachhmangarh Sikar	29
2710	Ladnun	29
2711	Lakheri	29
2712	Lalsot	29
2713	Losal	29
2714	Mahwah	29
2715	Makrana	29
2716	Malpura	29
2717	Mandal	29
2718	Mandalgarh	29
2719	Mandawar	29
2720	Mangrol	29
2721	Manohar Thana	29
2722	Manoharpur	29
2723	Meethari Marwar	29
2724	Merta	29
2725	Mundwa	29
2726	Nadbai	29
2727	Nagar	29
2728	Nagaur	29
2729	Nainwa	29
2730	Napasar	29
2731	Naraina	29
2732	Nasirabad	29
2733	Nathdwara	29
2734	Nawa	29
2735	Nawalgarh	29
2736	Neem ka Thana	29
2737	Nimaj	29
2738	Nimbahera	29
2739	Niwai	29
2740	Nohar	29
2741	Nokha	29
2742	Padampur	29
2743	Pali	29
2744	Partapur	29
2745	Parvatsar	29
2746	Phalodi	29
2747	Phulera	29
2748	Pilani	29
2749	Pilibangan	29
2750	Pindwara	29
2751	Pipar	29
2752	Pirawa	29
2753	Pokaran	29
2754	Pratapgarh	29
2755	Pushkar	29
2756	Raipur	29
2757	Raisinghnagar	29
2758	Rajakhera	29
2759	Rajaldesar	29
2760	Rajgarh	29
2761	Rajsamand	29
2762	Ramganj Mandi	29
2763	Ramgarh	29
2764	Rani	29
2765	Ratangarh	29
2766	Rawatbhata	29
2767	Rawatsar	29
2768	Ringas	29
2769	Sadri	29
2770	Salumbar	29
2771	Sambhar	29
2772	Samdari	29
2773	Sanchor	29
2774	Sangaria	29
2775	Sangod	29
2776	Sardarshahr	29
2777	Sarwar	29
2778	Sawai Madhopur	29
2779	Shahpura	29
2780	Sheoganj	29
2781	Sikar	29
2782	Sirohi	29
2783	Siwana	29
2784	Sojat	29
2785	Sri Dungargarh	29
2786	Sri Madhopur	29
2787	Sujangarh	29
2788	Suket	29
2789	Sunel	29
2790	Surajgarh	29
2791	Suratgarh	29
2792	Takhatgarh	29
2793	Taranagar	29
2794	Tijara	29
2795	Todabhim	29
2796	Todaraisingh	29
2797	Tonk	29
2798	Udaipur	29
2799	Udpura	29
2800	Uniara	29
2801	Wer	29
2802	East District	30
2803	Gangtok	30
2804	Gyalshing	30
2805	Jorethang	30
2806	Mangan	30
2807	Namchi	30
2808	Naya Bazar	30
2809	North District	30
2810	Rangpo	30
2811	Singtam	30
2812	South District	30
2813	West District	30
2814	Abiramam	31
2815	Adirampattinam	31
2816	Aduthurai	31
2817	Alagapuram	31
2818	Alandur	31
2819	Alanganallur	31
2820	Alangayam	31
2821	Alangudi	31
2822	Alangulam	31
2823	Alappakkam	31
2824	Alwa Tirunagari	31
2825	Ambasamudram	31
2826	Ambattur	31
2827	Ambur	31
2828	Ammapettai	31
2829	Anamalais	31
2830	Andippatti	31
2831	Annamalainagar	31
2832	Annavasal	31
2833	Annur	31
2834	Anthiyur	31
2835	Arakkonam	31
2836	Arantangi	31
2837	Arcot	31
2838	Arimalam	31
2839	Ariyalur	31
2840	Arni	31
2841	Arumbavur	31
2842	Arumuganeri	31
2843	Aruppukkottai	31
2844	Aruvankad	31
2845	Attayyampatti	31
2846	Attur	31
2847	Auroville	31
2848	Avadi	31
2849	Avinashi	31
2850	Ayakudi	31
2851	Ayyampettai	31
2852	Belur	31
2853	Bhavani	31
2854	Bodinayakkanur	31
2855	Chengam	31
2856	Chennai	31
2857	Chennimalai	31
2858	Chetput	31
2859	Chettipalaiyam	31
2860	Cheyyar	31
2861	Cheyyur	31
2862	Chidambaram	31
2863	Chingleput	31
2864	Chinna Salem	31
2865	Chinnamanur	31
2866	Chinnasekkadu	31
2867	Cholapuram	31
2868	Coimbatore	31
2869	Colachel	31
2870	Cuddalore	31
2871	Cumbum	31
2872	Denkanikota	31
2873	Desur	31
2874	Devadanappatti	31
2875	Devakottai	31
2876	Dhali	31
2877	Dharapuram	31
2878	Dharmapuri	31
2879	Dindigul	31
2880	Dusi	31
2881	Elayirampannai	31
2882	Elumalai	31
2883	Eral	31
2884	Eraniel	31
2885	Erode	31
2886	Erumaippatti	31
2887	Ettaiyapuram	31
2888	Gandhi Nagar	31
2889	Gangaikondan	31
2890	Gangavalli	31
2891	Gingee	31
2892	Gobichettipalayam	31
2893	Gudalur	31
2894	Gudiyatham	31
2895	Guduvancheri	31
2896	Gummidipundi	31
2897	Harur	31
2898	Hosur	31
2899	Idappadi	31
2900	Ilampillai	31
2901	Iluppur	31
2902	Injambakkam	31
2903	Irugur	31
2904	Jalakandapuram	31
2905	Jalarpet	31
2906	Jayamkondacholapuram	31
2907	Kadambur	31
2908	Kadayanallur	31
2909	Kalakkadu	31
2910	Kalavai	31
2911	Kallakkurichchi	31
2912	Kallidaikurichi	31
2913	Kallupatti	31
2914	Kalugumalai	31
2915	Kamuthi	31
2916	Kanadukattan	31
2917	Kancheepuram	31
2918	Kanchipuram	31
2919	Kangayam	31
2920	Kanniyakumari	31
2921	Karaikkudi	31
2922	Karamadai	31
2923	Karambakkudi	31
2924	Kariapatti	31
2925	Karumbakkam	31
2926	Karur	31
2927	Katpadi	31
2928	Kattivakkam	31
2929	Kattupputtur	31
2930	Kaveripatnam	31
2931	Kayalpattinam	31
2932	Kayattar	31
2933	Keelakarai	31
2934	Kelamangalam	31
2935	Kil Bhuvanagiri	31
2936	Kilvelur	31
2937	Kiranur	31
2938	Kodaikanal	31
2939	Kodumudi	31
2940	Kombai	31
2941	Konganapuram	31
2942	Koothanallur	31
2943	Koradachcheri	31
2944	Korampallam	31
2945	Kotagiri	31
2946	Kottaiyur	31
2947	Kovilpatti	31
2948	Krishnagiri	31
2949	Kulattur	31
2950	Kulittalai	31
2951	Kumaralingam	31
2952	Kumbakonam	31
2953	Kunnattur	31
2954	Kurinjippadi	31
2955	Kuttalam	31
2956	Kuzhithurai	31
2957	Lalgudi	31
2958	Madambakkam	31
2959	Madipakkam	31
2960	Madukkarai	31
2961	Madukkur	31
2962	Madurai	31
2963	Madurantakam	31
2964	Mallapuram	31
2965	Mallasamudram	31
2966	Mallur	31
2967	Manali	31
2968	Manalurpettai	31
2969	Manamadurai	31
2970	Manappakkam	31
2971	Manapparai	31
2972	Manavalakurichi	31
2973	Mandapam	31
2974	Mangalam	31
2975	Mannargudi	31
2976	Marakkanam	31
2977	Marandahalli	31
2978	Masinigudi	31
2979	Mattur	31
2980	Mayiladuthurai	31
2981	Melur	31
2982	Mettuppalaiyam	31
2983	Mettur	31
2984	Minjur	31
2985	Mohanur	31
2986	Mudukulattur	31
2987	Mulanur	31
2988	Musiri	31
2989	Muttupet	31
2990	Naduvattam	31
2991	Nagapattinam	31
2992	Nagercoil	31
2993	Namagiripettai	31
2994	Namakkal	31
2995	Nambiyur	31
2996	Nambutalai	31
2997	Nandambakkam	31
2998	Nangavalli	31
2999	Nangilickondan	31
3000	Nanguneri	31
3001	Nannilam	31
3002	Naravarikuppam	31
3003	Nattam	31
3004	Nattarasankottai	31
3005	Needamangalam	31
3006	Neelankarai	31
3007	Negapatam	31
3008	Nellikkuppam	31
3009	Nilakottai	31
3010	Nilgiris	31
3011	Odugattur	31
3012	Omalur	31
3013	Ooty	31
3014	Padmanabhapuram	31
3015	Palakkodu	31
3016	Palamedu	31
3017	Palani	31
3018	Palavakkam	31
3019	Palladam	31
3020	Pallappatti	31
3021	Pallattur	31
3022	Pallavaram	31
3023	Pallikondai	31
3024	Pallipattu	31
3025	Pallippatti	31
3026	Panruti	31
3027	Papanasam	31
3028	Papireddippatti	31
3029	Papparappatti	31
3030	Paramagudi	31
3031	Pattukkottai	31
3032	Pennadam	31
3033	Pennagaram	31
3034	Pennathur	31
3035	Peraiyur	31
3036	Perambalur	31
3037	Peranamallur	31
3038	Peranampattu	31
3039	Peravurani	31
3040	Periyakulam	31
3041	Periyanayakkanpalaiyam	31
3042	Periyanegamam	31
3043	Periyapatti	31
3044	Periyapattinam	31
3045	Perundurai	31
3046	Perungudi	31
3047	Perur	31
3048	Pollachi	31
3049	Polur	31
3050	Ponnamaravati	31
3051	Ponneri	31
3052	Poonamalle	31
3053	Porur	31
3054	Pudukkottai	31
3055	Puduppatti	31
3056	Pudur	31
3057	Puduvayal	31
3058	Puliyangudi	31
3059	Puliyur	31
3060	Pullambadi	31
3061	Punjai Puliyampatti	31
3062	Rajapalaiyam	31
3063	Ramanathapuram	31
3064	Rameswaram	31
3065	Ranipet	31
3066	Rasipuram	31
3067	Saint Thomas Mount	31
3068	Salem	31
3069	Sathankulam	31
3070	Sathyamangalam	31
3071	Sattur	31
3072	Sayalkudi	31
3073	Seven Pagodas	31
3074	Sholinghur	31
3075	Singanallur	31
3076	Singapperumalkovil	31
3077	Sirkazhi	31
3078	Sirumugai	31
3079	Sivaganga	31
3080	Sivagiri	31
3081	Sivakasi	31
3082	Srimushnam	31
3083	Sriperumbudur	31
3084	Srivaikuntam	31
3085	Srivilliputhur	31
3086	Suchindram	31
3087	Sulur	31
3088	Surandai	31
3089	Swamimalai	31
3090	Tambaram	31
3091	Tanjore	31
3092	Taramangalam	31
3093	Tattayyangarpettai	31
3094	Thanjavur	31
3095	Tharangambadi	31
3096	Theni	31
3097	Thenkasi	31
3098	Thirukattupalli	31
3099	Thiruthani	31
3100	Thiruvaiyaru	31
3101	Thiruvallur	31
3102	Thiruvarur	31
3103	Thiruvidaimaruthur	31
3104	Thoothukudi	31
3105	Tindivanam	31
3106	Tinnanur	31
3107	Tiruchchendur	31
3108	Tiruchengode	31
3109	Tiruchirappalli	31
3110	Tirukkoyilur	31
3111	Tirumullaivasal	31
3112	Tirunelveli	31
3113	Tirunelveli Kattabo	31
3114	Tiruppalaikudi	31
3115	Tirupparangunram	31
3116	Tiruppur	31
3117	Tiruppuvanam	31
3118	Tiruttangal	31
3119	Tiruvannamalai	31
3120	Tiruvottiyur	31
3121	Tisaiyanvilai	31
3122	Tondi	31
3123	Turaiyur	31
3124	Udangudi	31
3125	Udumalaippettai	31
3126	Uppiliyapuram	31
3127	Usilampatti	31
3128	Uttamapalaiyam	31
3129	Uttiramerur	31
3130	Uttukkuli	31
3131	V.S.K.Valasai (Dindigul-Dist.)	31
3132	Vadakku Valliyur	31
3133	Vadakku Viravanallur	31
3134	Vadamadurai	31
3135	Vadippatti	31
3136	Valangaiman	31
3137	Valavanur	31
3138	Vallam	31
3139	Valparai	31
3140	Vandalur	31
3141	Vandavasi	31
3142	Vaniyambadi	31
3143	Vasudevanallur	31
3144	Vattalkundu	31
3145	Vedaraniyam	31
3146	Vedasandur	31
3147	Velankanni	31
3148	Vellanur	31
3149	Vellore	31
3150	Velur	31
3151	Vengavasal	31
3152	Vettaikkaranpudur	31
3153	Vettavalam	31
3154	Vijayapuri	31
3155	Vikravandi	31
3156	Vilattikulam	31
3157	Villupuram	31
3158	Viraganur	31
3159	Virudhunagar	31
3160	Vriddhachalam	31
3161	Walajapet	31
3162	Wallajahbad	31
3163	Wellington	31
3164	Adilabad	32
3165	Alampur	32
3166	Andol	32
3167	Asifabad	32
3168	Balapur	32
3169	Banswada	32
3170	Bellampalli	32
3171	Bhadrachalam	32
3172	Bhadradri Kothagudem	32
3173	Bhaisa	32
3174	Bhongir	32
3175	Bodhan	32
3176	Chandur	32
3177	Chatakonda	32
3178	Dasnapur	32
3179	Devarkonda	32
3180	Dornakal	32
3181	Farrukhnagar	32
3182	Gaddi Annaram	32
3183	Gadwal	32
3184	Ghatkesar	32
3185	Gopalur	32
3186	Gudur	32
3187	Hyderabad	32
3188	Jagtial	32
3189	Jangaon	32
3190	Jayashankar Bhupalapally	32
3191	Jogulamba Gadwal	32
3192	Kagaznagar	32
3193	Kamareddi	32
3194	Kamareddy	32
3195	Karimnagar	32
3196	Khammam	32
3197	Kodar	32
3198	Koratla	32
3199	Kothapet	32
3200	Kottagudem	32
3201	Kottapalli	32
3202	Kukatpally	32
3203	Kyathampalle	32
3204	Lakshettipet	32
3205	Lal Bahadur Nagar	32
3206	Mahabubabad	32
3207	Mahbubnagar	32
3208	Malkajgiri	32
3209	Mancheral	32
3210	Mandamarri	32
3211	Manthani	32
3212	Manuguru	32
3213	Medak	32
3214	Medchal	32
3215	Medchal Malkajgiri	32
3216	Mirialguda	32
3217	Nagar Karnul	32
3218	Nalgonda	32
3219	Narayanpet	32
3220	Narsingi	32
3221	Naspur	32
3222	Nirmal	32
3223	Nizamabad	32
3224	Paloncha	32
3225	Palwancha	32
3226	Patancheru	32
3227	Peddapalli	32
3228	Quthbullapur	32
3229	Rajanna Sircilla	32
3230	Ramagundam	32
3231	Ramgundam	32
3232	Rangareddi	32
3233	Sadaseopet	32
3234	Sangareddi	32
3235	Sathupalli	32
3236	Secunderabad	32
3237	Serilingampalle	32
3238	Siddipet	32
3239	Singapur	32
3240	Sirpur	32
3241	Sirsilla	32
3242	Sriramnagar	32
3243	Suriapet	32
3244	Tandur	32
3245	Uppal Kalan	32
3246	Vemalwada	32
3247	Vikarabad	32
3248	Wanparti	32
3249	Warangal	32
3250	Yellandu	32
3251	Zahirabad	32
3252	Agartala	33
3253	Amarpur	33
3254	Ambasa	33
3255	Barjala	33
3256	Belonia	33
3257	Dhalai	33
3258	Dharmanagar	33
3259	Gomati	33
3260	Kailashahar	33
3261	Kamalpur	33
3262	Khowai	33
3263	North Tripura	33
3264	Ranir Bazar	33
3265	Sabrum	33
3266	Sonamura	33
3267	South Tripura	33
3268	Udaipur	33
3269	Unakoti	33
3270	West Tripura	33
3271	Achhnera	34
3272	Afzalgarh	34
3273	Agra	34
3274	Ahraura	34
3275	Aidalpur	34
3276	Airwa	34
3277	Akbarpur	34
3278	Akola	34
3279	Aliganj	34
3280	Aligarh	34
3281	Allahabad	34
3282	Allahganj	34
3283	Amanpur	34
3284	Amauli	34
3285	Ambahta	34
3286	Ambedkar Nagar	34
3287	Amethi	34
3288	Amroha	34
3289	Anandnagar	34
3290	Antu	34
3291	Anupshahr	34
3292	Aonla	34
3293	Araul	34
3294	Asalatganj	34
3295	Atarra	34
3296	Atrauli	34
3297	Atraulia	34
3298	Auraiya	34
3299	Auras	34
3300	Ayodhya	34
3301	Azamgarh	34
3302	Azizpur	34
3303	Baberu	34
3304	Babina	34
3305	Babrala	34
3306	Babugarh	34
3307	Bachhraon	34
3308	Bachhrawan	34
3309	Baghpat	34
3310	Baghra	34
3311	Bah	34
3312	Baheri	34
3313	Bahjoi	34
3314	Bahraich	34
3315	Bahraigh	34
3316	Bahsuma	34
3317	Bahua	34
3318	Bajna	34
3319	Bakewar	34
3320	Baksar	34
3321	Balamau	34
3322	Baldeo	34
3323	Baldev	34
3324	Ballia	34
3325	Balrampur	34
3326	Banat	34
3327	Banbasa	34
3328	Banda	34
3329	Bangarmau	34
3330	Bansdih	34
3331	Bansgaon	34
3332	Bansi	34
3333	Banthra	34
3334	Bara Banki	34
3335	Baragaon	34
3336	Baraut	34
3337	Bareilly	34
3338	Barhalganj	34
3339	Barkhera	34
3340	Barkhera Kalan	34
3341	Barokhar	34
3342	Barsana	34
3343	Barwar (Lakhimpur Kheri)	34
3344	Basti	34
3345	Behat	34
3346	Bela	34
3347	Belthara	34
3348	Beniganj	34
3349	Beswan	34
3350	Bewar	34
3351	Bhadarsa	34
3352	Bhadohi	34
3353	Bhagwantnagar	34
3354	Bharatpura	34
3355	Bhargain	34
3356	Bharthana	34
3357	Bharwari	34
3358	Bhaupur	34
3359	Bhimtal	34
3360	Bhinga	34
3361	Bhognipur	34
3362	Bhongaon	34
3363	Bidhnu	34
3364	Bidhuna	34
3365	Bighapur	34
3366	Bighapur Khurd	34
3367	Bijnor	34
3368	Bikapur	34
3369	Bilari	34
3370	Bilariaganj	34
3371	Bilaspur	34
3372	Bilgram	34
3373	Bilhaur	34
3374	Bilsanda	34
3375	Bilsi	34
3376	Bilthra	34
3377	Binauli	34
3378	Binaur	34
3379	Bindki	34
3380	Birdpur	34
3381	Birpur	34
3382	Bisalpur	34
3383	Bisanda Buzurg	34
3384	Bisauli	34
3385	Bisenda Buzurg	34
3386	Bishunpur Urf Maharajganj	34
3387	Biswan	34
3388	Bithur	34
3389	Budaun	34
3390	Budhana	34
3391	Bulandshahr	34
3392	Captainganj	34
3393	Chail	34
3394	Chakia	34
3395	Chandauli	34
3396	Chandauli District	34
3397	Chandausi	34
3398	Chandpur	34
3399	Chanduasi	34
3400	Charkhari	34
3401	Charthawal	34
3402	Chhaprauli	34
3403	Chharra	34
3404	Chhata	34
3405	Chhibramau	34
3406	Chhitauni	34
3407	Chhutmalpur	34
3408	Chillupar	34
3409	Chirgaon	34
3410	Chitrakoot	34
3411	Chitrakoot Dham	34
3412	Chopan	34
3413	Chunar	34
3414	Churk	34
3415	Colonelganj	34
3416	Dadri	34
3417	Dalmau	34
3418	Dankaur	34
3419	Daraganj	34
3420	Daranagar	34
3421	Dasna	34
3422	Dataganj	34
3423	Daurala	34
3424	Dayal Bagh	34
3425	Deoband	34
3426	Deogarh	34
3427	Deoranian	34
3428	Deoria	34
3429	Derapur	34
3430	Dewa	34
3431	Dhampur	34
3432	Dhanaura	34
3433	Dhanghata	34
3434	Dharau	34
3435	Dhaurahra	34
3436	Dibai	34
3437	Divrasai	34
3438	Dohrighat	34
3439	Domariaganj	34
3440	Dostpur	34
3441	Dudhi	34
3442	Etah	34
3443	Etawah	34
3444	Etmadpur	34
3445	Faizabad	34
3446	Farah	34
3447	Faridnagar	34
3448	Faridpur	34
3449	Farrukhabad	34
3450	Fatehabad	34
3451	Fatehganj West	34
3452	Fatehgarh	34
3453	Fatehpur	34
3454	Fatehpur (Barabanki)	34
3455	Fatehpur Chaurasi	34
3456	Fatehpur Sikri	34
3457	Firozabad	34
3458	Fyzabad	34
3459	Gahlon	34
3460	Gahmar	34
3461	Gaini	34
3462	Gajraula	34
3463	Gangoh	34
3464	Ganj Dundawara	34
3465	Ganj Dundwara	34
3466	Ganj Muradabad	34
3467	Garautha	34
3468	Garhi Pukhta	34
3469	Garhmuktesar	34
3470	Garhwa	34
3471	Gauriganj	34
3472	Gautam Buddha Nagar	34
3473	Gawan	34
3474	Ghatampur	34
3475	Ghaziabad	34
3476	Ghazipur	34
3477	Ghiror	34
3478	Ghorawal	34
3479	Ghosi	34
3480	Gohand	34
3481	Gokul	34
3482	Gola Bazar	34
3483	Gola Gokarannath	34
3484	Gonda	34
3485	Gopamau	34
3486	Gorakhpur	34
3487	Gosainganj	34
3488	Goshainganj	34
3489	Govardhan	34
3490	Greater Noida	34
3491	Gulaothi	34
3492	Gunnaur	34
3493	Gursahaiganj	34
3494	Gursarai	34
3495	Gyanpur	34
3496	Haldaur	34
3497	Hamirpur	34
3498	Handia	34
3499	Hapur	34
3500	Haraipur	34
3501	Haraiya	34
3502	Harchandpur	34
3503	Hardoi	34
3504	Harduaganj	34
3505	Hasanpur	34
3506	Hastinapur	34
3507	Hata	34
3508	Hata (India)	34
3509	Hathras	34
3510	Hulas	34
3511	Ibrahimpur	34
3512	Iglas	34
3513	Ikauna	34
3514	Indergarh	34
3515	Indragarh	34
3516	Islamnagar	34
3517	Islamnagar (Badaun)	34
3518	Itaunja	34
3519	Itimadpur	34
3520	Jagdishpur	34
3521	Jagnair	34
3522	Jahanabad	34
3523	Jahanabad (Pilibhit)	34
3524	Jahangirabad	34
3525	Jahangirpur	34
3526	Jainpur	34
3527	Jais	34
3528	Jalalabad	34
3529	Jalali	34
3530	Jalalpur	34
3531	Jalaun	34
3532	Jalesar	34
3533	Janghai	34
3534	Jansath	34
3535	Jarwa	34
3536	Jarwal	34
3537	Jasrana	34
3538	Jaswantnagar	34
3539	Jaunpur	34
3540	Jewar	34
3541	Jhajhar	34
3542	Jhalu	34
3543	Jhansi	34
3544	Jhinjhak	34
3545	Jhinjhana	34
3546	Jhusi	34
3547	Jiyanpur	34
3548	Jyotiba Phule Nagar	34
3549	Kabrai	34
3550	Kachhwa	34
3551	Kadaura	34
3552	Kadipur	34
3553	Kagarol	34
3554	Kaimganj	34
3555	Kairana	34
3556	Kakori	34
3557	Kakrala	34
3558	Kalinagar	34
3559	Kalpi	34
3560	Kalyanpur	34
3561	Kamalganj	34
3562	Kampil	34
3563	Kandhla	34
3564	Kannauj	34
3565	Kanpur	34
3566	Kanpur Dehat	34
3567	Kant	34
3568	Kanth	34
3569	Kaptanganj	34
3570	Kara	34
3571	Karari	34
3572	Karbigwan	34
3573	Karchana	34
3574	Karhal	34
3575	Kasganj	34
3576	Katra	34
3577	Kausani	34
3578	Kaushambi District	34
3579	Kemri	34
3580	Khada	34
3581	Khaga	34
3582	Khailar	34
3583	Khair	34
3584	Khairabad	34
3585	Khalilabad	34
3586	Khanpur	34
3587	Kharela	34
3588	Khargupur	34
3589	Kharkhauda	34
3590	Khatauli	34
3591	Khekra	34
3592	Kheri	34
3593	Khudaganj	34
3594	Khurja	34
3595	Khutar	34
3596	Kirakat	34
3597	Kiraoli	34
3598	Kiratpur	34
3599	Kishanpur	34
3600	Kishanpur baral	34
3601	Kishni	34
3602	Kithor	34
3603	Konch	34
3604	Kopaganj	34
3605	Kosi	34
3606	Kota	34
3607	Kotra	34
3608	Kuchesar	34
3609	Kudarkot	34
3610	Kulpahar	34
3611	Kunda	34
3612	Kundarkhi	34
3613	Kundarki	34
3614	Kurara	34
3615	Kurebharsaidkhanpur	34
3616	Kushinagar	34
3617	Kusmara	34
3618	Kuthaund	34
3619	Laharpur	34
3620	Lakhimpur	34
3621	Lakhna	34
3622	Lalganj	34
3623	Lalitpur	34
3624	Lambhua	34
3625	Lar	34
3626	Lawar	34
3627	Lawar Khas	34
3628	Loni	34
3629	Lucknow	34
3630	Lucknow District	34
3631	Machhali Shahar	34
3632	Machhlishahr	34
3633	Madhoganj	34
3634	Madhogarh	34
3635	Maghar	34
3636	Mahaban	34
3637	Maharajganj	34
3638	Mahmudabad	34
3639	Mahoba	34
3640	Maholi	34
3641	Mahrajganj	34
3642	Mahrajganj (Raebareli)	34
3643	Mahroni	34
3644	Mahul	34
3645	Mailani	34
3646	Mainpuri	34
3647	Majhupur	34
3648	Makanpur	34
3649	Malasa	34
3650	Malihabad	34
3651	Mandawar	34
3652	Maniar	34
3653	Manikpur	34
3654	Manjhanpur	34
3655	Mankapur	34
3656	Marahra	34
3657	Mariahu	34
3658	Mataundh	34
3659	Mathura	34
3660	Mau	34
3661	Mau Aima	34
3662	Mau Aimma	34
3663	Maudaha	34
3664	Maurawan	34
3665	Mawana	34
3666	Mawar	34
3667	Meerut	34
3668	Mehdawal	34
3669	Mehnagar	34
3670	Mehndawal	34
3671	Milak	34
3672	Milkipur	34
3673	Miranpur	34
3674	Miranpur Katra	34
3675	Mirganj	34
3676	Mirzapur	34
3677	Misrikh	34
3678	Mohan	34
3679	Mohanpur	34
3680	Moradabad	34
3681	Moth	34
3682	Mubarakpur	34
3683	Mughal Sarai	34
3684	Muhammadabad	34
3685	Mukteshwar	34
3686	Mungra Badshahpur	34
3687	Munsyari	34
3688	Muradabad	34
3689	Muradnagar	34
3690	Mursan	34
3691	Musafir-Khana	34
3692	Musafirkhana	34
3693	Muzaffarnagar	34
3694	Nadigaon	34
3695	Nagina	34
3696	Nagla	34
3697	Nagram	34
3698	Najibabad	34
3699	Nakur	34
3700	Nanauta	34
3701	Nandgaon	34
3702	Nanpara	34
3703	Narauli	34
3704	Naraura	34
3705	Narora	34
3706	Naugama	34
3707	Naurangpur	34
3708	Nautanwa	34
3709	Nawabganj	34
3710	Nawabganj (Barabanki)	34
3711	Nawabganj (Bareilly)	34
3712	Newara	34
3713	Nichlaul	34
3714	Nigoh	34
3715	Nihtaur	34
3716	Niwari	34
3717	Nizamabad	34
3718	Noida	34
3719	Nurpur	34
3720	Obra	34
3721	Orai	34
3722	Oran	34
3723	Pachperwa	34
3724	Padrauna	34
3725	Pahasu	34
3726	Paigaon	34
3727	Pali	34
3728	Palia Kalan	34
3729	Paras Rampur	34
3730	Parichha	34
3731	Parichhatgarh	34
3732	Parshadepur	34
3733	Pathakpura	34
3734	Patiali	34
3735	Patti	34
3736	Pawayan	34
3737	Payagpur	34
3738	Phalauda	34
3739	Phaphamau	34
3740	Phaphund	34
3741	Phariha	34
3742	Pheona	34
3743	Phulpur	34
3744	Pichhaura	34
3745	Pihani	34
3746	Pilibhit	34
3747	Pilkhua	34
3748	Pilkhuwa	34
3749	Pinahat	34
3750	Pipraich	34
3751	Pipri	34
3752	Pratapgarh	34
3753	Prayagraj (Allahabad)	34
3754	Pukhrayan	34
3755	Puranpur	34
3756	Purmafi	34
3757	Purwa	34
3758	Qadirganj	34
3759	Rabupura	34
3760	Radha Kund	34
3761	Radhakund	34
3762	Raebareli	34
3763	Rajapur	34
3764	Ramkola	34
3765	Ramnagar	34
3766	Rampur	34
3767	Rampura	34
3768	Ranipur	34
3769	Ranipur Barsi	34
3770	Rasra	34
3771	Rasulabad	34
3772	Rath	34
3773	Raya	34
3774	Rehar	34
3775	Renukoot	34
3776	Renukut	34
3777	Reoti	34
3778	Reotipur	34
3779	Richha	34
3780	Robertsganj	34
3781	Rudarpur	34
3782	Rudauli	34
3783	Rura	34
3784	Sabalpur	34
3785	Sachendi	34
3786	Sadabad	34
3787	Sadat	34
3788	Safipur	34
3789	Saharanpur	34
3790	Sahaspur	34
3791	Sahaswan	34
3792	Sahawar	34
3793	Sahibabad	34
3794	Sahpau	34
3795	Saidpur	34
3796	Sakhanu	34
3797	Sakit	34
3798	Salempur	34
3799	Salon	34
3800	Sambhal	34
3801	Samthar	34
3802	Sandi	34
3803	Sandila	34
3804	Sant Kabir Nagar	34
3805	Sant Ravi Das Nagar	34
3806	Sarai Akil	34
3807	Sarai Ekdil	34
3808	Sarai Mir	34
3809	Sarauli	34
3810	Sardhana	34
3811	Sarila	34
3812	Sarurpur	34
3813	Sasni	34
3814	Satrikh	34
3815	Saurikh	34
3816	Sector	34
3817	Seohara	34
3818	Shahabad	34
3819	Shahganj	34
3820	Shahi	34
3821	Shahjahanpur	34
3822	Shahpur	34
3823	Shamli	34
3824	Shamsabad	34
3825	Shankargarh	34
3826	Shergarh	34
3827	Sherkot	34
3828	Shibnagar	34
3829	Shikarpur	34
3830	Shikarpur (Bulandshahr)	34
3831	Shikohabad	34
3832	Shishgarh	34
3833	Shivrajpur	34
3834	Shrawasti	34
3835	Siddharthnagar	34
3836	Siddhaur	34
3837	Sidhauli	34
3838	Sidhpura	34
3839	Sikandarabad	34
3840	Sikandarpur	34
3841	Sikandra	34
3842	Sikandra Rao	34
3843	Sikandrabad	34
3844	Sirathu	34
3845	Sirsa	34
3846	Sirsaganj	34
3847	Sirsi	34
3848	Sisauli	34
3849	Siswa Bazar	34
3850	Sitapur	34
3851	Sonbhadra	34
3852	Soron	34
3853	Suar	34
3854	Sultanpur	34
3855	Surianwan	34
3856	Tajpur	34
3857	Talbahat	34
3858	Talgram	34
3859	Tanda	34
3860	Terha	34
3861	Thakurdwara	34
3862	Thana Bhawan	34
3863	Tigri	34
3864	Tikaitnagar	34
3865	Tikri	34
3866	Tilhar	34
3867	Tilsahri	34
3868	Tindwari	34
3869	Titron	34
3870	Tori Fatehpur	34
3871	Tori-Fatehpur	34
3872	Tulsipur	34
3873	Tundla	34
3874	Ugu	34
3875	Ujhani	34
3876	Umri	34
3877	Un	34
3878	Unnao	34
3879	Usawan	34
3880	Usehat	34
3881	Uska	34
3882	Utraula	34
3883	Varanasi	34
3884	Vindhyachal	34
3885	Vrindavan	34
3886	Walterganj	34
3887	Wazirganj	34
3888	Yusufpur	34
3889	Zafarabad	34
3890	Zaidpur	34
3891	Zamania	34
3892	Almora	35
3893	Bageshwar	35
3894	Barkot	35
3895	Bazpur	35
3896	Bhim Tal	35
3897	Bhowali	35
3898	Birbhaddar	35
3899	Chakrata	35
3900	Chamoli	35
3901	Champawat	35
3902	Clement Town	35
3903	Dehradun	35
3904	Devaprayag	35
3905	Dharchula	35
3906	Doiwala	35
3907	Dugadda	35
3908	Dwarahat	35
3909	Garhwal	35
3910	Haldwani	35
3911	Harbatpur	35
3912	Haridwar	35
3913	Jaspur	35
3914	Joshimath	35
3915	Kaladhungi	35
3916	Kalagarh Project Colony	35
3917	Kashipur	35
3918	Khatima	35
3919	Kichha	35
3920	Kotdwara	35
3921	Laksar	35
3922	Lansdowne	35
3923	Lohaghat	35
3924	Manglaur	35
3925	Mussoorie	35
3926	Naini Tal	35
3927	Narendranagar	35
3928	Pauri	35
3929	Pipalkoti	35
3930	Pithoragarh	35
3931	Raipur	35
3932	Raiwala Bara	35
3933	Ramnagar	35
3934	Ranikhet	35
3935	Rishikesh	35
3936	Roorkee	35
3937	Rudraprayag	35
3938	Sitarganj	35
3939	Srinagar	35
3940	Sultanpur	35
3941	Tanakpur	35
3942	Tehri	35
3943	Tehri-Garhwal	35
3944	Udham Singh Nagar	35
3945	Uttarkashi	35
3946	Vikasnagar	35
3947	Adra	36
3948	Ahmedpur	36
3949	Aistala	36
3950	Aknapur	36
3951	Alipurduar	36
3952	Amlagora	36
3953	Amta	36
3954	Amtala	36
3955	Andal	36
3956	Arambagh community development block	36
3957	Asansol	36
3958	Ashoknagar Kalyangarh	36
3959	Badkulla	36
3960	Baduria	36
3961	Bagdogra	36
3962	Bagnan	36
3963	Bagula	36
3964	Bahula	36
3965	Baidyabati	36
3966	Bakreswar	36
3967	Balarampur	36
3968	Bali Chak	36
3969	Bally	36
3970	Balurghat	36
3971	Bamangola community development block	36
3972	Baneswar	36
3973	Bangaon	36
3974	Bankra	36
3975	Bankura	36
3976	Bansberia	36
3977	Bansihari community development block	36
3978	Barabazar	36
3979	Baranagar	36
3980	Barasat	36
3981	Bardhaman	36
3982	Barjora	36
3983	Barrackpore	36
3984	Baruipur	36
3985	Basanti	36
3986	Basirhat	36
3987	Bawali	36
3988	Begampur	36
3989	Belda	36
3990	Beldanga	36
3991	Beliatore	36
3992	Berhampore	36
3993	Bhadreswar	36
3994	Bhandardaha	36
3995	Bhatpara	36
3996	Birbhum district	36
3997	Birpara	36
3998	Bishnupur	36
3999	Bolpur	36
4000	Budge Budge	36
4001	Canning	36
4002	Chakapara	36
4003	Chakdaha	36
4004	Champadanga	36
4005	Champahati	36
4006	Champdani	36
4007	Chandannagar	36
4008	Chandrakona	36
4009	Chittaranjan	36
4010	Churulia	36
4011	Contai	36
4012	Cooch Behar	36
4013	Cossimbazar	36
4014	Dakshin Dinajpur district	36
4015	Dalkola	36
4016	Dam Dam	36
4017	Darjeeling	36
4018	Daulatpur	36
4019	Debagram	36
4020	Debipur	36
4021	Dhaniakhali community development block	36
4022	Dhulagari	36
4023	Dhulian	36
4024	Dhupguri	36
4025	Diamond Harbour	36
4026	Digha	36
4027	Dinhata	36
4028	Domjur	36
4029	Dubrajpur	36
4030	Durgapur	36
4031	Egra	36
4032	Falakata	36
4033	Farakka	36
4034	Fort Gloster	36
4035	Gaighata community development block	36
4036	Gairkata	36
4037	Gangadharpur	36
4038	Gangarampur	36
4039	Garui	36
4040	Garulia	36
4041	Ghatal	36
4042	Giria	36
4043	Gobardanga	36
4044	Gobindapur	36
4045	Gopalpur	36
4046	Gopinathpur	36
4047	Gorubathan	36
4048	Gosaba	36
4049	Gosanimari	36
4050	Gurdaha	36
4051	Guskhara	36
4052	Habra	36
4053	Haldia	36
4054	Haldibari	36
4055	Halisahar	36
4056	Harindanga	36
4057	Haringhata	36
4058	Haripur	36
4059	Hasimara	36
4060	Hindusthan Cables Town	36
4061	Hooghly district	36
4062	Howrah	36
4063	Ichapur	36
4064	Indpur community development block	36
4065	Ingraj Bazar	36
4066	Islampur	36
4067	Jafarpur	36
4068	Jaigaon	36
4069	Jalpaiguri	36
4070	Jamuria	36
4071	Jangipur	36
4072	Jaynagar Majilpur	36
4073	Jejur	36
4074	Jhalida	36
4075	Jhargram	36
4076	Jhilimili	36
4077	Kakdwip	36
4078	Kalaikunda	36
4079	Kaliaganj	36
4080	Kalimpong	36
4081	Kalna	36
4082	Kalyani	36
4083	Kamarhati	36
4084	Kamarpukur	36
4085	Kanchrapara	36
4086	Kandi	36
4087	Karimpur	36
4088	Katwa	36
4089	Kenda	36
4090	Keshabpur	36
4091	Kharagpur	36
4092	Kharar	36
4093	Kharba	36
4094	Khardaha	36
4095	Khatra	36
4096	Kirnahar	36
4097	Kolkata	36
4098	Konnagar	36
4099	Krishnanagar	36
4100	Krishnapur	36
4101	Kshirpai	36
4102	Kulpi	36
4103	Kultali	36
4104	Kulti	36
4105	Kurseong	36
4106	Lalgarh	36
4107	Lalgola	36
4108	Loyabad	36
4109	Madanpur	36
4110	Madhyamgram	36
4111	Mahiari	36
4112	Mahishadal community development block	36
4113	Mainaguri	36
4114	Manikpara	36
4115	Masila	36
4116	Mathabhanga	36
4117	Matiali community development block	36
4118	Matigara community development block	36
4119	Medinipur	36
4120	Mejia community development block	36
4121	Memari	36
4122	Mirik	36
4123	Monoharpur	36
4124	Muragacha	36
4125	Muri	36
4126	Murshidabad	36
4127	Nabadwip	36
4128	Nabagram	36
4129	Nadia district	36
4130	Nagarukhra	36
4131	Nagrakata	36
4132	Naihati	36
4133	Naksalbari	36
4134	Nalhati	36
4135	Nalpur	36
4136	Namkhana community development block	36
4137	Nandigram	36
4138	Nangi	36
4139	Nayagram community development block	36
4140	North 24 Parganas district	36
4141	Odlabari	36
4142	Paikpara	36
4143	Panagarh	36
4144	Panchla	36
4145	Panchmura	36
4146	Pandua	36
4147	Panihati	36
4148	Panskura	36
4149	Parbatipur	36
4150	Paschim Medinipur district	36
4151	Patiram	36
4152	Patrasaer	36
4153	Patuli	36
4154	Pujali	36
4155	Puncha community development block	36
4156	Purba Medinipur district	36
4157	Purulia	36
4158	Raghudebbati	36
4159	Raghunathpur	36
4160	Raiganj	36
4161	Rajmahal	36
4162	Rajnagar community development block	36
4163	Ramchandrapur	36
4164	Ramjibanpur	36
4165	Ramnagar	36
4166	Rampur Hat	36
4167	Ranaghat	36
4168	Raniganj	36
4169	Raypur	36
4170	Rishra	36
4171	Sahapur	36
4172	Sainthia	36
4173	Salanpur community development block	36
4174	Sankarpur	36
4175	Sankrail	36
4176	Santipur	36
4177	Santoshpur	36
4178	Santuri community development block	36
4179	Sarenga	36
4180	Serampore	36
4181	Serpur	36
4182	Shyamnagar West Bengal	36
4183	Siliguri	36
4184	Singur	36
4185	Sodpur	36
4186	Solap	36
4187	Sonada	36
4188	Sonamukhi	36
4189	Sonarpur community development block	36
4190	South 24 Parganas district	36
4191	Srikhanda	36
4192	Srirampur	36
4193	Suri	36
4194	Swarupnagar community development block	36
4195	Takdah	36
4196	Taki	36
4197	Tamluk	36
4198	Tarakeswar	36
4199	Titagarh	36
4200	Tufanganj	36
4201	Tulin	36
4202	Uchalan	36
4203	Ula	36
4204	Uluberia	36
4205	Uttar Dinajpur district	36
4206	Uttarpara Kotrung	36
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, code, type, value, expiry_date, usage_limit, used_count, created_at) FROM stdin;
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, product_variant_id, quantity_total, quantity_reserved, last_updated) FROM stdin;
9f9ce4f8-c3fb-4b89-b948-0f83f4f425de	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	100	0	2026-04-08 04:58:06.822842+00
a4cc9767-cafb-429d-8b22-b5a4378c7804	ae7f678d-0140-426e-8044-b96272c71214	100	1	2026-04-08 09:26:16.96184+00
c8c90e76-c163-47a7-ae90-c1042746ba33	a88c0355-2324-455d-bda3-c662fe009a1f	100	0	2026-04-08 09:29:07.190674+00
a9559864-89ac-4d50-899a-d77f277fa346	264b1859-d5b8-4a7f-b8da-00b37e8c0564	99	-1	2026-04-08 09:34:05.213655+00
a37e9dee-361c-490a-92fb-ddcc675ad13d	91f73c62-3c01-483c-886d-e9fb01e37469	10	0	2026-04-08 11:33:14.543308+00
283f42ac-58c0-4a4b-b606-23333aac4d9a	dc7b4006-174c-4138-9f26-1bae64bafca0	10	0	2026-04-08 11:33:14.653194+00
c0ed47a8-0fb7-41e7-8311-b31c99f2bca5	22849f71-95dd-4919-8de6-c95c7763c3cc	10	0	2026-04-08 11:33:14.802436+00
f9ded7bd-ed83-445c-bc27-a98109ae4c3d	da7a4d80-74b2-4e1d-bda8-baedde35e487	10	0	2026-04-08 11:33:14.923836+00
112c3469-52ce-42ea-a856-992ff48476b7	63450b46-bb77-4f6c-a0e6-b086e5c77c7f	100	0	2025-04-13 13:57:39.165266+00
459ec127-809b-43be-8031-1aa21714ef20	89a6525f-e983-431a-82d0-d2b336a8ce5f	100	0	2025-04-13 13:57:39.232954+00
d446a016-c721-4cbb-805a-b2f454888556	a749d064-cec4-4612-8227-03f919e197aa	100	0	2025-04-13 13:57:39.287105+00
7771cd43-850d-428d-b780-5501f2bf13c6	ae7f678d-0140-426e-8044-b96272c71212	100	0	2025-04-13 13:57:39.387009+00
cdbdc92b-23bb-4dcf-bf87-5f5730f4e663	2b7a7d17-aa43-4576-aed7-e45d37c124c4	100	0	2025-04-13 13:57:39.536071+00
2176424b-3ba5-4567-88d5-334de05c3380	83d75616-db69-41da-ae6b-96fefaec6f48	100	0	2025-04-13 13:57:39.586449+00
cf4c5c39-c1ba-4fcc-bfd5-b0c4f042c2ba	8a6c060c-a1cf-4ceb-886a-b349590477bb	100	0	2025-04-13 13:57:39.636227+00
58eb1d1f-53cc-4923-9685-36d382714420	a425e2ec-271f-47a2-b4f1-f65f60559426	100	0	2025-04-13 13:57:39.686164+00
e209e050-23e9-4bbb-a402-556884f3183a	e1846c7d-3178-4d23-9cd8-dcdcf04d5c88	100	0	2025-04-13 13:57:39.736629+00
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, quantity, price, product_variant_id) FROM stdin;
189f762a-35a7-4fa4-9706-f84482edd2ea	485eaff3-3d99-449c-8573-a9b0be72ff2b	5	300.00	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88
f27615dd-a96f-4462-9f89-fd9d4fa9d67c	485eaff3-3d99-449c-8573-a9b0be72ff2b	1	300.00	ae7f678d-0140-426e-8044-b96272c71214
5f042aac-7533-474a-8ffc-0cbc2750c83b	485eaff3-3d99-449c-8573-a9b0be72ff2b	1	200.00	264b1859-d5b8-4a7f-b8da-00b37e8c0564
f77d678e-4fed-4217-b041-9b3148bd6940	c1cf5d12-efba-4916-8943-5d7b98e54b73	5	300.00	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88
92184e8b-5f88-4585-9a2d-737da5c27e9d	c1cf5d12-efba-4916-8943-5d7b98e54b73	1	300.00	ae7f678d-0140-426e-8044-b96272c71214
32f8fa73-52c5-4e2a-aafa-21fdf76d89f1	c1cf5d12-efba-4916-8943-5d7b98e54b73	1	200.00	264b1859-d5b8-4a7f-b8da-00b37e8c0564
931c50e5-6d65-411e-a1e6-6c968d4abc29	4c41f2c8-b4a1-48f9-880e-fe339cbb44d2	5	300.00	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88
ad819f82-a8ac-412e-90ca-d07cfb90875b	4c41f2c8-b4a1-48f9-880e-fe339cbb44d2	1	300.00	ae7f678d-0140-426e-8044-b96272c71214
bd2479ee-b326-4436-8237-222a2e8f17f9	4c41f2c8-b4a1-48f9-880e-fe339cbb44d2	1	200.00	264b1859-d5b8-4a7f-b8da-00b37e8c0564
8604cdaa-df1e-4e2b-ae49-f0d703d85d90	4d9a894b-8f95-4fde-b11e-6a65815c6ea5	5	300.00	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88
2b218ff2-10a3-4404-aeec-4fe3507c78dd	4d9a894b-8f95-4fde-b11e-6a65815c6ea5	1	300.00	ae7f678d-0140-426e-8044-b96272c71214
bae0f111-b069-4731-a6f9-c5011603a624	4d9a894b-8f95-4fde-b11e-6a65815c6ea5	1	200.00	264b1859-d5b8-4a7f-b8da-00b37e8c0564
e24f7e81-2a38-49ba-8660-ee779ed2a9ca	4342ae8a-29d4-458c-bdea-be0d190f2526	1	999.00	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88
9fe4fe21-3f79-4750-a24a-2d979ae988b6	7d08d6b6-a3c8-437b-b728-915f9a185608	2	999.00	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88
764226fe-5041-4fc4-b19d-5e5537c40739	3cbd9c8f-ce89-492d-abde-3f9acec2108a	1	999.00	da7a4d80-74b2-4e1d-bda8-baedde35e487
34d6222f-870d-4349-8542-a7e95818ab0e	907dee1e-0835-4786-9e50-046a5249ecff	1	999.00	da7a4d80-74b2-4e1d-bda8-baedde35e487
59f87d7f-b0cf-4fde-8b6e-1b5bedbca7e4	570ab46f-da52-4c04-be2e-c5bcfde1469d	1	999.00	da7a4d80-74b2-4e1d-bda8-baedde35e487
2db471c9-f11f-47d0-95f5-15e5bd96f108	82a3298c-2b3b-450e-9405-0f292842c282	1	899.00	22849f71-95dd-4919-8de6-c95c7763c3cc
b267ae1e-1a6f-4cb2-a599-74e23c6b2d5e	e8bd4937-f36f-4d37-bc73-4bd93cb67c8c	1	899.00	22849f71-95dd-4919-8de6-c95c7763c3cc
88908966-23c1-4442-a17c-a5fb7e5f9fd5	afa834fd-b799-436f-87eb-5b2b7cf8d6fe	1	899.00	22849f71-95dd-4919-8de6-c95c7763c3cc
2efbe1f3-e3b8-4b17-8e61-132e85e6df89	7ed696e6-a1b1-400f-a39b-ab4c8925485c	1	1299.00	ae7f678d-0140-426e-8044-b96272c71214
a7af9d90-41ef-4847-ba94-13719252c210	3c3ecaa0-6c0b-47b3-9257-2cb6b8aa32b1	1	999.00	a88c0355-2324-455d-bda3-c662fe009a1f
73d04c23-6c1e-47a8-b923-169b5be0904d	2419dfcd-97d3-49f2-9990-032141cea532	1	200.00	264b1859-d5b8-4a7f-b8da-00b37e8c0564
\.


--
-- Data for Name: order_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_tracking (id, order_id, order_token, tracking_status, changed_at, notes) FROM stdin;
121	485eaff3-3d99-449c-8573-a9b0be72ff2b	0fg7vflk2K6hageP6qhSS	received	2025-04-26 13:03:10.66038	\N
122	485eaff3-3d99-449c-8573-a9b0be72ff2b	0fg7vflk2K6hageP6qhSS	processing	2025-04-26 13:03:10.66038	\N
123	c1cf5d12-efba-4916-8943-5d7b98e54b73	VOG_Fq_F3rVoNUdXRVL7S	received	2025-04-26 13:03:24.377104	\N
124	c1cf5d12-efba-4916-8943-5d7b98e54b73	VOG_Fq_F3rVoNUdXRVL7S	processing	2025-04-26 13:03:24.377104	\N
125	4c41f2c8-b4a1-48f9-880e-fe339cbb44d2	g6Um7jjLPDGecRSG3H33j	received	2025-04-26 13:14:25.993867	\N
126	4c41f2c8-b4a1-48f9-880e-fe339cbb44d2	g6Um7jjLPDGecRSG3H33j	processing	2025-04-26 13:14:25.993867	\N
127	4d9a894b-8f95-4fde-b11e-6a65815c6ea5	eTXEn3cI9xSfyb1xWUQij	received	2025-04-26 13:21:37.355488	\N
128	4d9a894b-8f95-4fde-b11e-6a65815c6ea5	eTXEn3cI9xSfyb1xWUQij	processing	2025-04-26 13:21:37.355488	\N
129	4342ae8a-29d4-458c-bdea-be0d190f2526	pFbT16wR-AznyyWMImiZx	received	2026-04-07 14:45:54.801465	\N
130	4342ae8a-29d4-458c-bdea-be0d190f2526	pFbT16wR-AznyyWMImiZx	processing	2026-04-07 14:45:54.801465	\N
131	4342ae8a-29d4-458c-bdea-be0d190f2526	pFbT16wR-AznyyWMImiZx	processing	2026-04-07 18:51:26.377656	\N
132	4342ae8a-29d4-458c-bdea-be0d190f2526	pFbT16wR-AznyyWMImiZx	shipped	2026-04-07 18:51:41.777294	\N
133	7d08d6b6-a3c8-437b-b728-915f9a185608	uvvsQqnU0SJLj4hutzQH4	received	2026-04-08 04:58:06.822842	\N
134	7d08d6b6-a3c8-437b-b728-915f9a185608	uvvsQqnU0SJLj4hutzQH4	processing	2026-04-08 04:58:06.822842	\N
135	3cbd9c8f-ce89-492d-abde-3f9acec2108a	JVEI789JBok_iVn96Wnob	received	2026-04-08 08:24:04.994052	\N
136	3cbd9c8f-ce89-492d-abde-3f9acec2108a	JVEI789JBok_iVn96Wnob	processing	2026-04-08 08:24:04.994052	\N
137	907dee1e-0835-4786-9e50-046a5249ecff	NwZO4YHKw2J7ItjfJICbn	received	2026-04-08 08:33:54.799124	\N
138	907dee1e-0835-4786-9e50-046a5249ecff	NwZO4YHKw2J7ItjfJICbn	processing	2026-04-08 08:33:54.799124	\N
139	570ab46f-da52-4c04-be2e-c5bcfde1469d	zwupq6JSJG_Mrh0cTJZg8	received	2026-04-08 08:36:52.535323	\N
140	570ab46f-da52-4c04-be2e-c5bcfde1469d	zwupq6JSJG_Mrh0cTJZg8	processing	2026-04-08 08:36:52.535323	\N
141	82a3298c-2b3b-450e-9405-0f292842c282	ps6q6OsMY0bJD4Z7B2bLG	received	2026-04-08 08:40:16.465613	\N
142	82a3298c-2b3b-450e-9405-0f292842c282	ps6q6OsMY0bJD4Z7B2bLG	processing	2026-04-08 08:40:16.465613	\N
143	e8bd4937-f36f-4d37-bc73-4bd93cb67c8c	ObPyOnPPqkzFwZUnuz2Fy	received	2026-04-08 08:46:51.369294	\N
144	e8bd4937-f36f-4d37-bc73-4bd93cb67c8c	ObPyOnPPqkzFwZUnuz2Fy	processing	2026-04-08 08:46:51.369294	\N
145	afa834fd-b799-436f-87eb-5b2b7cf8d6fe	d2zatR4ctcEU_l7ntF_oe	received	2026-04-08 08:53:09.998023	\N
146	afa834fd-b799-436f-87eb-5b2b7cf8d6fe	d2zatR4ctcEU_l7ntF_oe	processing	2026-04-08 08:53:09.998023	\N
147	7ed696e6-a1b1-400f-a39b-ab4c8925485c	c1ahRwhCgs39eTk6ofb9h	received	2026-04-08 09:26:16.96184	\N
148	7ed696e6-a1b1-400f-a39b-ab4c8925485c	c1ahRwhCgs39eTk6ofb9h	processing	2026-04-08 09:26:16.96184	\N
149	3c3ecaa0-6c0b-47b3-9257-2cb6b8aa32b1	H4JkZJvQqSEltn4Op3VtL	received	2026-04-08 09:29:07.190674	\N
150	3c3ecaa0-6c0b-47b3-9257-2cb6b8aa32b1	H4JkZJvQqSEltn4Op3VtL	processing	2026-04-08 09:29:07.190674	\N
151	2419dfcd-97d3-49f2-9990-032141cea532	bH23USZTGzumUr4Wxkjno	received	2026-04-08 09:32:56.836263	\N
152	2419dfcd-97d3-49f2-9990-032141cea532	bH23USZTGzumUr4Wxkjno	processing	2026-04-08 09:32:56.836263	\N
153	2419dfcd-97d3-49f2-9990-032141cea532	bH23USZTGzumUr4Wxkjno	processing	2026-04-08 09:34:05.213655	Payment verified successfully. Order is being processed.
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total_amount, status, payment_status, payment_method, shipping_address_id, metadata, created_at, updated_at, order_token) FROM stdin;
4d9a894b-8f95-4fde-b11e-6a65815c6ea5	32be4fea-c4be-4dec-81c5-afec41063bce	2000.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{}	2025-04-26 13:21:37.355488	2025-04-26 13:21:46.082136	eTXEn3cI9xSfyb1xWUQij
7ed696e6-a1b1-400f-a39b-ab4c8925485c	32be4fea-c4be-4dec-81c5-afec41063bce	1299.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 09:26:16.96184	2026-04-08 09:26:24.422703	c1ahRwhCgs39eTk6ofb9h
e8bd4937-f36f-4d37-bc73-4bd93cb67c8c	32be4fea-c4be-4dec-81c5-afec41063bce	899.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 08:46:51.369294	2026-04-08 08:52:29.698689	ObPyOnPPqkzFwZUnuz2Fy
3cbd9c8f-ce89-492d-abde-3f9acec2108a	32be4fea-c4be-4dec-81c5-afec41063bce	999.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 08:24:04.994052	2026-04-08 08:24:19.081186	JVEI789JBok_iVn96Wnob
4342ae8a-29d4-458c-bdea-be0d190f2526	32be4fea-c4be-4dec-81c5-afec41063bce	999.00	shipped	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{}	2026-04-07 14:45:54.801465	2026-04-07 18:51:41.726142	pFbT16wR-AznyyWMImiZx
2419dfcd-97d3-49f2-9990-032141cea532	32be4fea-c4be-4dec-81c5-afec41063bce	200.00	processing	completed	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 09:32:56.836263	2026-04-08 09:34:05.213655	bH23USZTGzumUr4Wxkjno
907dee1e-0835-4786-9e50-046a5249ecff	32be4fea-c4be-4dec-81c5-afec41063bce	999.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 08:33:54.799124	2026-04-08 08:34:03.29692	NwZO4YHKw2J7ItjfJICbn
3c3ecaa0-6c0b-47b3-9257-2cb6b8aa32b1	32be4fea-c4be-4dec-81c5-afec41063bce	999.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 09:29:07.190674	2026-04-08 09:29:16.016819	H4JkZJvQqSEltn4Op3VtL
570ab46f-da52-4c04-be2e-c5bcfde1469d	32be4fea-c4be-4dec-81c5-afec41063bce	999.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 08:36:52.535323	2026-04-08 08:36:57.402989	zwupq6JSJG_Mrh0cTJZg8
afa834fd-b799-436f-87eb-5b2b7cf8d6fe	32be4fea-c4be-4dec-81c5-afec41063bce	899.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 08:53:09.998023	2026-04-08 09:25:52.244866	d2zatR4ctcEU_l7ntF_oe
82a3298c-2b3b-450e-9405-0f292842c282	32be4fea-c4be-4dec-81c5-afec41063bce	899.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 08:40:16.465613	2026-04-08 08:40:27.077873	ps6q6OsMY0bJD4Z7B2bLG
7d08d6b6-a3c8-437b-b728-915f9a185608	32be4fea-c4be-4dec-81c5-afec41063bce	1998.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{"contact": {"lastName": "Shah", "firstName": "Tanmay", "phoneNumber": "+919156834423"}, "shipping": {"zip": "", "city": "", "type": "home", "state": "", "street": "", "landmark": "", "flatHouseNo": ""}}	2026-04-08 04:58:06.822842	2026-04-08 06:32:45.119077	uvvsQqnU0SJLj4hutzQH4
485eaff3-3d99-449c-8573-a9b0be72ff2b	32be4fea-c4be-4dec-81c5-afec41063bce	2000.00	checked_out	pending	razorpay	\N	{}	2025-04-26 13:03:10.66038	2025-04-26 13:03:10.66038	0fg7vflk2K6hageP6qhSS
c1cf5d12-efba-4916-8943-5d7b98e54b73	32be4fea-c4be-4dec-81c5-afec41063bce	2000.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{}	2025-04-26 13:03:24.377104	2025-04-26 13:03:30.445472	VOG_Fq_F3rVoNUdXRVL7S
4c41f2c8-b4a1-48f9-880e-fe339cbb44d2	32be4fea-c4be-4dec-81c5-afec41063bce	2000.00	checked_out	pending	razorpay	1433fe1b-11c1-4fc1-a53a-cff0b6b750ec	{}	2025-04-26 13:14:25.993867	2025-04-26 13:14:32.410832	g6Um7jjLPDGecRSG3H33j
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, user_id, order_id, razorpay_payment_id, razorpay_order_id, status, amount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (product_id, category_id) FROM stdin;
97427585-8334-48e8-b4a4-1500024518e4	6ac28147-2899-41e8-bec3-c9e47921601b
ab1c1867-2b3a-4e0b-9553-9126770afdcf	dab29e45-212f-4ce7-8cb4-35fbd7ed581a
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, product_id, color, color_hex_code, price, stock, image_url, is_default, created_at, metadata, type, weight, slug) FROM stdin;
4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	97427585-8334-48e8-b4a4-1500024518e4	Walnut Brown	#3c3631	999.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/closeup_texture_r1rn9r.png	f	2025-03-16 04:42:21.978348	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/room_close_out_pbuufx.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/close_up_room_jbtop2.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/fulldrape_lxjbrx.png"], "variant_description": ""}	door	0.50	luxe-curtain-walnut-brown-door-1
63450b46-bb77-4f6c-a0e6-b086e5c77c7f	97427585-8334-48e8-b4a4-1500024518e4	Walnut Brown	#3c3631	899.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/closeup_texture_r1rn9r.png	f	2025-03-16 04:42:21.978348	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/room_close_out_pbuufx.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/close_up_room_jbtop2.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/fulldrape_lxjbrx.png"], "variant_description": ""}	window	0.50	luxe-curtain-walnut-brown-window-1
89a6525f-e983-431a-82d0-d2b336a8ce5f	97427585-8334-48e8-b4a4-1500024518e4	Azure	#748b96	899.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565709/azure_drape_pi3ekd.png	f	2025-03-16 04:42:21.978348	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565709/azure_room_full_wkhjhg.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565710/azure_room_close_up_vatytb.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565749/azure_drape_ltwuci.png"], "variant_description": ""}	window	0.50	luxe-curtain-azure-window-1
a749d064-cec4-4612-8227-03f919e197aa	97427585-8334-48e8-b4a4-1500024518e4	Dusty Rose	#9e8a82	899.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_closeup_cebnto.png	f	2025-03-16 04:42:21.978348	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_bedroom_vtoc63.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572788/dusty_rose_room_full_ya2pdp.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_drape_vdwb2u.png"], "variant_description": ""}	window	0.50	luxe-curtain-dusty-rose-window-1
a88c0355-2324-455d-bda3-c662fe009a1f	97427585-8334-48e8-b4a4-1500024518e4	Azure	#748b96	999.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565709/azure_drape_pi3ekd.png	f	2025-03-16 04:42:21.978348	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565709/azure_room_full_wkhjhg.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565710/azure_room_close_up_vatytb.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775565749/azure_drape_ltwuci.png"], "variant_description": ""}	door	0.50	luxe-curtain-azure-door-1
ae7f678d-0140-426e-8044-b96272c71212	97427585-8334-48e8-b4a4-1500024518e4	Dusty Rose	#9e8a82	999.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_closeup_cebnto.png	f	2025-03-16 04:42:21.978348	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_bedroom_vtoc63.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572788/dusty_rose_room_full_ya2pdp.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_drape_vdwb2u.png"], "variant_description": ""}	door	0.50	luxe-curtain-dusty-rose-door-1
ae7f678d-0140-426e-8044-b96272c71214	97427585-8334-48e8-b4a4-1500024518e4	Dusty Rose	#9e8a82	1299.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_closeup_cebnto.png	f	2025-03-18 14:57:17.248253	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_bedroom_vtoc63.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572788/dusty_rose_room_full_ya2pdp.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775572789/dusty_rose_drape_vdwb2u.png"], "variant_description": ""}	long	0.50	luxe-curtain-dusty-rose-long-1
264b1859-d5b8-4a7f-b8da-00b37e8c0564	ab1c1867-2b3a-4e0b-9553-9126770afdcf	Deep Olive	#57572f	200.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1742039014/Deep%20Olive.png	f	2025-03-16 04:42:21.978348	{}	window	0.50	patterned-drapes-curtains-deep-olive-window-1
2b7a7d17-aa43-4576-aed7-e45d37c124c4	ab1c1867-2b3a-4e0b-9553-9126770afdcf	Deep Teal	#0b4e70	200.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1742039142/Deep%20Teal.png	f	2025-03-16 04:42:21.978348	{}	window	0.50	patterned-drapes-curtains-deep-teal-window-1
83d75616-db69-41da-ae6b-96fefaec6f48	ab1c1867-2b3a-4e0b-9553-9126770afdcf	Rustic Brown	#52332b	200.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1742039098/Rustic%20brown.png	f	2025-03-16 04:42:21.978348	{}	window	0.50	patterned-drapes-curtains-rustic-brown-window-1
8a6c060c-a1cf-4ceb-886a-b349590477bb	ab1c1867-2b3a-4e0b-9553-9126770afdcf	Deep Olive	#57572f	300.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1742039014/Deep%20Olive.png	f	2025-03-16 04:42:21.978348	{}	door	0.50	patterned-drapes-curtains-deep-olive-door-1
a425e2ec-271f-47a2-b4f1-f65f60559426	ab1c1867-2b3a-4e0b-9553-9126770afdcf	Rustic Brown	#52332b	300.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1742039098/Rustic%20brown.png	f	2025-03-16 04:42:21.978348	{}	door	0.50	patterned-drapes-curtains-rustic-brown-door-1
e1846c7d-3178-4d23-9cd8-dcdcf04d5c88	ab1c1867-2b3a-4e0b-9553-9126770afdcf	Deep Teal	#0b4e70	300.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1742039142/Deep%20Teal.png	f	2025-03-16 04:42:21.978348	{}	door	0.50	patterned-drapes-curtains-deep-teal-door-1
91f73c62-3c01-483c-886d-e9fb01e37469	dcb17468-6a42-45fd-98fb-9c07d8e3bdef	Platinum Whisper	#C0C0C0	999.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/gray_blackout_closeup_b6ggit.png	f	2026-04-08 07:18:52.855955	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632250/gray_blackout_bedroom_s1txqs.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632251/blackout_bedroom_gray_2_beicco.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632250/blackout_drape_gray_avuhme.png"], "variant_description": ""}	Door	0.50	meridian-luxe-platinum-whisper-door-1
dc7b4006-174c-4138-9f26-1bae64bafca0	dcb17468-6a42-45fd-98fb-9c07d8e3bdef	Venetian Gold	#E6D5B8	1099.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632250/blackout_pale_gold_closeup_wvtgbf.png	f	2026-04-08 08:22:31.495276	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/pale_gold_background_dwp1ah.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/pale_gold_blackout_bedroom_im4zba.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/pale_gold_drape_gtpxyj.png"], "variant_description": ""}	Door	0.50	meridian-luxe-venetian-gold-door
22849f71-95dd-4919-8de6-c95c7763c3cc	dcb17468-6a42-45fd-98fb-9c07d8e3bdef	Platinum Whisper	#C0C0C0	899.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/gray_blackout_closeup_b6ggit.png	f	2026-04-08 07:18:52.836493	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632250/gray_blackout_bedroom_s1txqs.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632251/blackout_bedroom_gray_2_beicco.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632250/blackout_drape_gray_avuhme.png"], "variant_description": ""}	Window	0.50	meridian-luxe-platinum-whisper-window-1
da7a4d80-74b2-4e1d-bda8-baedde35e487	dcb17468-6a42-45fd-98fb-9c07d8e3bdef	Venetian Gold	#E6D5B8	999.00	10	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632250/blackout_pale_gold_closeup_wvtgbf.png	f	2026-04-08 08:22:31.496702	{"gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/pale_gold_background_dwp1ah.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/pale_gold_blackout_bedroom_im4zba.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775632249/pale_gold_drape_gtpxyj.png"], "variant_description": ""}	Window	0.50	meridian-luxe-venetian-gold-window
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, stock, image_url, created_at, metadata, is_discontinued, tag) FROM stdin;
97427585-8334-48e8-b4a4-1500024518e4	Luxe Curtain	Transform your space with the Teal Luxe Drapes, a perfect blend of sophistication and functionality. Crafted from premium fabric, these curtains offer a rich texture, graceful drape, and a timeless appeal. The deep teal hue adds a touch of regal charm, making them an ideal choice for both modern and classic interiors.	0.00	0	https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/closeup_texture_r1rn9r.png	2025-03-16 04:32:19.783324	{"sizes": ["Window (5feet by 11 feet)", "Door (7feet by 11 feet)"], "features": ["Luxurious Fabric – Soft, smooth, and durable for a refined look.", "Light Filtering – Allows just the right amount of natural light.", "Elegant Drape – Flows beautifully, enhancing your decor.", "Versatile Styling – Perfect for living rooms, bedrooms, and dining areas.", "Easy Maintenance – Wrinkle-resistant and machine washable."], "wash_care": "Machine wash cold, tumble dry low", "fabric_details": {"gsm": "300", "lining": "Unlined", "opacity": "Light Filtering", "material": "Polyester Blend"}, "gallery_images": ["https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/room_close_out_pbuufx.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/close_up_room_jbtop2.png", "https://res.cloudinary.com/dhxa5zutl/image/upload/v1775560926/fulldrape_lxjbrx.png"], "available_sizes": ["window", "door", "long"]}	f	premium
ab1c1867-2b3a-4e0b-9553-9126770afdcf	Patterned Drapes Curtains	Enhance your space with our Patterned Drapes, a perfect blend of artistry and elegance. Featuring intricate designs inspired by nature, these curtains add a sophisticated yet cozy touch to any room. Crafted from premium fabrics, they provide soft texture, durability, and light control, making them ideal for both modern and classic interiors.	200.00	0	\N	2025-03-16 04:32:19.783324	{"sizes": ["Window (5feet by 11 feet)", "Door (7feet by 11 feet)"], "features": ["Elegant Patterns – Intricately designed with nature-inspired motifs.", "Premium Fabric – Soft, durable, and luxurious to the touch.", "Light Control – Balances privacy while allowing natural light to filter in.", "Versatile Styling – Perfect for living rooms, bedrooms, and office spaces.", "Easy Maintenance – Wrinkle-resistant and machine washable for convenience."]}	f	sale
dcb17468-6a42-45fd-98fb-9c07d8e3bdef	Meridian Luxe		0.00	0		2026-04-08 07:11:15.854082	{"features": [], "wash_care": "", "fabric_details": {"gsm": "", "lining": "", "opacity": "", "material": ""}, "available_sizes": ["Window", "Door"]}	f	sale
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, product_variant_id, quantity, created_at, expires_at, last_heartbeat, status, order_token) FROM stdin;
55	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	5	2025-04-26 13:03:10.66038+00	2025-04-26 13:18:10.66038+00	2025-04-26 13:03:11.289133+00	expired	0fg7vflk2K6hageP6qhSS
56	ae7f678d-0140-426e-8044-b96272c71214	1	2025-04-26 13:03:10.66038+00	2025-04-26 13:18:10.66038+00	2025-04-26 13:03:11.289133+00	expired	0fg7vflk2K6hageP6qhSS
57	264b1859-d5b8-4a7f-b8da-00b37e8c0564	1	2025-04-26 13:03:10.66038+00	2025-04-26 13:18:10.66038+00	2025-04-26 13:03:11.289133+00	expired	0fg7vflk2K6hageP6qhSS
58	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	5	2025-04-26 13:03:24.377104+00	2025-04-26 13:18:24.377104+00	2025-04-26 13:14:10.000467+00	expired	VOG_Fq_F3rVoNUdXRVL7S
59	ae7f678d-0140-426e-8044-b96272c71214	1	2025-04-26 13:03:24.377104+00	2025-04-26 13:18:24.377104+00	2025-04-26 13:14:10.000467+00	expired	VOG_Fq_F3rVoNUdXRVL7S
60	264b1859-d5b8-4a7f-b8da-00b37e8c0564	1	2025-04-26 13:03:24.377104+00	2025-04-26 13:18:24.377104+00	2025-04-26 13:14:10.000467+00	expired	VOG_Fq_F3rVoNUdXRVL7S
71	da7a4d80-74b2-4e1d-bda8-baedde35e487	1	2026-04-08 08:36:52.535323+00	2026-04-08 08:51:52.535323+00	2026-04-08 08:47:27.689266+00	expired	zwupq6JSJG_Mrh0cTJZg8
67	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	1	2026-04-07 14:45:54.801465+00	2026-04-07 15:00:54.801465+00	2026-04-07 14:48:29.348122+00	expired	pFbT16wR-AznyyWMImiZx
76	a88c0355-2324-455d-bda3-c662fe009a1f	1	2026-04-08 09:29:07.190674+00	2026-04-08 09:44:07.190674+00	2026-04-08 09:55:15.131056+00	expired	H4JkZJvQqSEltn4Op3VtL
69	da7a4d80-74b2-4e1d-bda8-baedde35e487	1	2026-04-08 08:24:04.994052+00	2026-04-08 08:39:04.994052+00	2026-04-08 08:47:27.56692+00	expired	JVEI789JBok_iVn96Wnob
68	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	2	2026-04-08 04:58:06.822842+00	2026-04-08 05:13:06.822842+00	2026-04-08 07:30:16.456562+00	expired	uvvsQqnU0SJLj4hutzQH4
73	22849f71-95dd-4919-8de6-c95c7763c3cc	1	2026-04-08 08:46:51.369294+00	2026-04-08 09:01:51.369294+00	2026-04-08 09:08:12.085222+00	expired	ObPyOnPPqkzFwZUnuz2Fy
74	22849f71-95dd-4919-8de6-c95c7763c3cc	1	2026-04-08 08:53:09.998023+00	2026-04-08 09:08:09.998023+00	2026-04-08 09:25:57.270191+00	expired	d2zatR4ctcEU_l7ntF_oe
70	da7a4d80-74b2-4e1d-bda8-baedde35e487	1	2026-04-08 08:33:54.799124+00	2026-04-08 08:48:54.799124+00	2026-04-08 08:47:27.630584+00	expired	NwZO4YHKw2J7ItjfJICbn
72	22849f71-95dd-4919-8de6-c95c7763c3cc	1	2026-04-08 08:40:16.465613+00	2026-04-08 08:55:16.465613+00	2026-04-08 08:47:27.721349+00	expired	ps6q6OsMY0bJD4Z7B2bLG
75	ae7f678d-0140-426e-8044-b96272c71214	1	2026-04-08 09:26:16.96184+00	2026-04-08 09:41:16.96184+00	2026-04-08 09:26:17.516583+00	active	c1ahRwhCgs39eTk6ofb9h
77	264b1859-d5b8-4a7f-b8da-00b37e8c0564	1	2026-04-08 09:32:56.836263+00	2026-04-08 09:47:56.836263+00	2026-04-08 09:55:15.133092+00	expired	bH23USZTGzumUr4Wxkjno
64	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	5	2025-04-26 13:21:37.355488+00	2025-04-26 13:36:37.355488+00	2025-04-27 12:53:14.257302+00	expired	eTXEn3cI9xSfyb1xWUQij
65	ae7f678d-0140-426e-8044-b96272c71214	1	2025-04-26 13:21:37.355488+00	2025-04-26 13:36:37.355488+00	2025-04-27 12:53:14.257302+00	expired	eTXEn3cI9xSfyb1xWUQij
66	264b1859-d5b8-4a7f-b8da-00b37e8c0564	1	2025-04-26 13:21:37.355488+00	2025-04-26 13:36:37.355488+00	2025-04-27 12:53:14.257302+00	expired	eTXEn3cI9xSfyb1xWUQij
61	4ecd7b3b-51c4-4588-8e44-2d396ebc9d88	5	2025-04-26 13:14:25.993867+00	2025-04-26 13:29:25.993867+00	2025-04-26 13:21:21.315448+00	expired	g6Um7jjLPDGecRSG3H33j
62	ae7f678d-0140-426e-8044-b96272c71214	1	2025-04-26 13:14:25.993867+00	2025-04-26 13:29:25.993867+00	2025-04-26 13:21:21.315448+00	expired	g6Um7jjLPDGecRSG3H33j
63	264b1859-d5b8-4a7f-b8da-00b37e8c0564	1	2025-04-26 13:14:25.993867+00	2025-04-26 13:29:25.993867+00	2025-04-26 13:21:21.315448+00	expired	g6Um7jjLPDGecRSG3H33j
\.


--
-- Data for Name: serviceable_pincodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.serviceable_pincodes (id, pincode, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, token, expires_at) FROM stdin;
a562e06e-0863-4bc4-b27d-1c793b8d7b32	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDM5MjE3NSwiZXhwIjoxNzQ0OTk2OTc1fQ.CgNQxNa2hSthchjkCytNvRvVGMoSeOmW4wq82bHCajQ	2025-04-18 22:52:55.78
4506643a-4379-412a-8a27-51e78f09ecbb	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDQzNjA1NSwiZXhwIjoxNzQ1MDQwODU1fQ.KEdohRr8IGMCXhkJURiLZrkJnY6VHz-raYp-CV5eXCk	2025-04-19 11:04:15.896
66d3d8de-b0c1-4e7e-9806-d9e03dfda36a	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDQzNjUyMCwiZXhwIjoxNzQ1MDQxMzIwfQ.rXgAeGv0J3Y_zAMbs06BWkUv2PYkOuMtNASxoH4SDWY	2025-04-19 11:12:00.457
8058379e-e454-4953-b337-22a787e84122	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDQzNjc2MSwiZXhwIjoxNzQ0NDM2ODIxfQ.99Sphh9Z7RufcQ4WIko2gvSDFkrFvkrOIwze-ZZ-_To	2025-04-19 11:16:01.925
acf7e448-b03d-44c6-b580-286698d8d2b5	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDQzNzAyMiwiZXhwIjoxNzQ1MDQxODIyfQ.sb6DFFYiYLo3HVNJLKGC3oHUzvXLupmTBwu3i3ad2lE	2025-04-19 11:20:22.683
dd99c8f7-2b6e-4f6f-9e04-f289998e339c	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDU1NTgyOSwiZXhwIjoxNzQ1MTYwNjI5fQ.kN6mDw1tmzhizLlj9VB4I2J6Q_OuR7AiNjaQ8zIShWk	2025-04-20 20:20:29.272
70254d53-8112-4238-b91b-23dc2a5d0c25	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NTY1NTE3MywiZXhwIjoxNzQ2MjU5OTczfQ.3aCfxusuwvYajsykvwGmx8Ho4blFr8dFDh0qB2Y7awc	2025-05-03 13:42:53.786
5ec01f76-883e-4cc9-8c9a-299e7dc1a6ce	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NTY3MTE1NSwiZXhwIjoxNzQ2Mjc1OTU1fQ.jxBo28tuwbIiQPymhZoRegwTgJ2rbexwm6HATll6hkY	2025-05-03 18:09:15.059
9f0d01c1-4ca2-48c3-9fd9-7aec7918cd03	32be4fea-c4be-4dec-81c5-afec41063bce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzJiZTRmZWEtYzRiZS00ZGVjLTgxYzUtYWZlYzQxMDYzYmNlIiwibmFtZSI6IlRhbm1heSBTaGFoIiwiZW1haWwiOiJzaGFodGFubWF5MTNAZ21haWwuY29tIiwicGhvbmUiOm51bGx9LCJ0eXBlIjoicmVmcmVzaCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTU1OTAxMCwiZXhwIjoxNzc2MTYzODEwfQ.tO-b2EN79KOAdmXPGa2bgk3BgfdsQWnul1KSdPfYi6c	2026-04-14 16:20:10.304
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.states (id, name, country) FROM stdin;
1	Andaman and Nicobar Islands	India
2	Andhra Pradesh	India
3	Arunachal Pradesh	India
4	Assam	India
5	Bihar	India
6	Chandigarh	India
7	Chhattisgarh	India
8	Dadra and Nagar Haveli and Daman and Diu	India
9	Delhi	India
10	Goa	India
11	Gujarat	India
12	Haryana	India
13	Himachal Pradesh	India
14	Jammu and Kashmir	India
15	Jharkhand	India
16	Karnataka	India
17	Kerala	India
18	Ladakh	India
19	Lakshadweep	India
20	Madhya Pradesh	India
21	Maharashtra	India
22	Manipur	India
23	Meghalaya	India
24	Mizoram	India
25	Nagaland	India
26	Odisha	India
27	Puducherry	India
28	Punjab	India
29	Rajasthan	India
30	Sikkim	India
31	Tamil Nadu	India
32	Telangana	India
33	Tripura	India
34	Uttar Pradesh	India
35	Uttarakhand	India
36	West Bengal	India
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, phone, created_at) FROM stdin;
9e173137-f770-4446-ab92-591bad1a6a58	Tanmay Shah	shahhtanmay@gmail.com	$2b$10$17eYSq923FjJ.Cn39yjfM.lE99LdHYmWG4eiYU1pffgskyA4uNIZG		2025-03-11 13:29:32.603873
32be4fea-c4be-4dec-81c5-afec41063bce	Tanmay Shah	shahtanmay13@gmail.com		\N	2025-03-14 13:38:00.250836
d65a13e3-0fe8-4c38-9248-86e847f5e6a1	Tanmay Shah	tanmay@gmail.com	$2b$10$IS.NHTsHg93HVvPk7GnZ.ucbIHGY1y0VwyBCwPQK6MuDB7H8/jkd.		2025-03-15 11:52:57.415192
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist (id, user_id, product_id, created_at) FROM stdin;
\.


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cities_id_seq', 4206, true);


--
-- Name: order_tracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_tracking_id_seq', 153, true);


--
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_seq', 77, true);


--
-- Name: states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.states_id_seq', 37, true);


--
-- Name: ad_spend_logs ad_spend_logs_log_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ad_spend_logs
    ADD CONSTRAINT ad_spend_logs_log_date_key UNIQUE (log_date);


--
-- Name: ad_spend_logs ad_spend_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ad_spend_logs
    ADD CONSTRAINT ad_spend_logs_pkey PRIMARY KEY (id);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: cities cities_name_state_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_name_state_id_key UNIQUE (name, state_id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_tracking order_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracking
    ADD CONSTRAINT order_tracking_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_token_key UNIQUE (order_token);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (product_id, category_id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_slug_key UNIQUE (slug);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: serviceable_pincodes serviceable_pincodes_pincode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serviceable_pincodes
    ADD CONSTRAINT serviceable_pincodes_pincode_key UNIQUE (pincode);


--
-- Name: serviceable_pincodes serviceable_pincodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serviceable_pincodes
    ADD CONSTRAINT serviceable_pincodes_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: states states_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_name_key UNIQUE (name);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


--
-- Name: inventory unique_product_variant; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT unique_product_variant UNIQUE (product_variant_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (id);


--
-- Name: idx_inventory_variant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_variant ON public.inventory USING btree (product_variant_id);


--
-- Name: idx_reservations_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_expires_at ON public.reservations USING btree (expires_at);


--
-- Name: idx_reservations_variant_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_variant_active ON public.reservations USING btree (product_variant_id) WHERE (status = 'active'::text);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cart cart_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cities cities_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id) ON DELETE CASCADE;


--
-- Name: reservations fk_order_token; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_order_token FOREIGN KEY (order_token) REFERENCES public.orders(order_token);


--
-- Name: inventory inventory_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_tracking order_tracking_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracking
    ADD CONSTRAINT order_tracking_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_tracking order_tracking_order_token_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracking
    ADD CONSTRAINT order_tracking_order_token_fkey FOREIGN KEY (order_token) REFERENCES public.orders(order_token) ON DELETE CASCADE;


--
-- Name: orders orders_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES public.addresses(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: product_categories product_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: product_categories product_categories_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: order_items product_variant_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT product_variant_id FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

