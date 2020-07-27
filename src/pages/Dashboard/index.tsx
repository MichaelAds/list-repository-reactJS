import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { TweenMax } from "gsap";
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories)
    } else {
      return [];
    }
  });

  let repositoryItem = useRef(null) ;
  let iconEffect = useRef(null);
  let repositoriesRef = useRef(null);

  useEffect(() => {
    if (repositoryItem.current) {
      TweenMax.from(repositoryItem.current, 2, {
        opacity: 0,
        x: -100
      })
    }

    if (iconEffect.current) {
      TweenMax.from(iconEffect.current, 2, {
        opacity: 0,
        scale: .4
      })
    }
  }, [])

  useEffect(()=> {
    if(repositoriesRef.current) {
      TweenMax.from(repositoriesRef.current, 2, {
        opacity: 0,
        x: -100
      })
    }

    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
  }, [repositories])

  // htmlformelement representa o elemento do html, ajudandno no event
  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    // para não redirecionar a tela
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    // try = apresentação da informação sem erro, caso tenha erro vai cair no catch
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository])
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }

  }


  return (
    <>
      <img ref={ iconEffect } src={logoImg} alt="Github Explorer" />
      <Title ref={ repositoryItem }>Explore repositórios no GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
        value={newRepo}
        onChange={(e) => setNewRepo(e.target.value)}
        placeholder="Digite o nome do repositório"/>
        <button>Pesquisar</button>
      </Form>

      {/* a chave a baixo representa um if, e o && representa o else assim formando a  */}
      { inputError && <Error>{ inputError }</Error> }

      <Repositories ref={ repositoriesRef }>
        {repositories.map((repository) => (
          <Link  key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt={repository.owner.login}/>

            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  )
};

export default Dashboard;
