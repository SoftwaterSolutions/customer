import { FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeAreaWrap from '../../../../components/SafeAreaWrap/SafeAreaWrap';

import fonts from '../../../../constants/fonts';
import CustomText from '../../../../components/CustomText/CustomText';
import { COLORS } from '../../../../constants/colors';
import { Col, Row } from '../../../../components/CustomGrid/CustomGrid';
import { useDispatch, useSelector } from 'react-redux';
import LeftArrow from '../../../../assets/svgs/leftArrow.svg';

const AboutUs = ({ navigation }) => {
  const dispatch = useDispatch();
  const { countries, country } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  const ItemCard = ({ item, index, onPress, cartItems }) => (
    <Row>
      <CustomText
        color={COLORS.black}
        align="left"
        top={10}
        left={10}
        right={10}
        fontSize={12}
        fontFamily={fonts.PoppinsRegular}
        style={{ lineHeight: 18 }}
      >
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est nihil
        eveniet sequi! Voluptate incidunt nisi at illo! Commodi eveniet
        provident soluta cupiditate nostrum eius vero ullam consequatur
        corporis, eum qui dolor doloremque harum nam placeat. Expedita, officia
        quas. Eveniet, tempora rerum asperiores adipisci optio voluptates
        suscipit eum, illum temporibus odio accusamus, officiis minima totam?
        Corporis officia, obcaecati consequatur, illo deserunt optio sunt error
        cum esse ab est adipisci mollitia quis expedita! Doloribus et
        dignissimos odit qui eveniet. Veniam ducimus expedita quaerat quasi
        animi repellat deleniti repudiandae ipsa optio, aliquam eligendi saepe
        doloremque alias, corrupti dolorum architecto maiores provident
        recusandae ratione doloribus? Asperiores nihil suscipit eaque totam
        doloremque doloribus ducimus praesentium sunt dicta corporis, ullam odit
        saepe architecto officiis? Eos minima ab accusamus ullam error, nemo
        esse placeat nisi repellat dolores eius fugiat magnam voluptas
        voluptatem eaque saepe expedita, ipsum repudiandae hic, inventore itaque
        temporibus in? Suscipit animi incidunt explicabo optio sit, aperiam
        vitae sapiente culpa sequi consequatur consectetur sed consequuntur
        perferendis cumque perspiciatis ipsa enim distinctio nulla voluptatibus
        quae at ducimus assumenda quod adipisci! Ex, similique officiis. Quas
        modi saepe doloribus quaerat architecto veniam voluptate quis veritatis,
        inventore enim explicabo? Deleniti magni maiores laboriosam culpa
        recusandae, dolores delectus iste provident voluptatem est eum,
        aspernatur qui, laborum vel quis natus rerum perferendis quae adipisci
        impedit accusamus iure ullam autem iusto. Voluptatum explicabo eligendi
        accusamus sapiente consectetur ut rerum iure cupiditate maiores laborum
        libero assumenda, deserunt labore corporis iste provident animi ducimus.
        Reiciendis, inventore possimus! Fuga asperiores voluptas necessitatibus
        esse commodi aperiam accusantium quibusdam cupiditate? Aliquam,
        accusantium! Corporis deleniti officia dicta beatae vitae voluptas
        itaque libero velit, rerum architecto, fuga quos blanditiis quaerat a
        doloremque dolore mollitia cum minus eum quae excepturi ratione! Nisi ex
        laudantium autem sunt nulla quae qui, harum accusantium possimus dolorum
        veniam ea eligendi perferendis nobis ab aliquid voluptas fugiat
        excepturi similique quos consectetur pariatur! Ratione excepturi culpa
        omnis soluta et sit, aperiam maiores inventore dolorum dolores porro
        quae laboriosam officia, facere nulla distinctio ad consequatur quis
        molestias accusamus dolore. Accusantium officia quod, laudantium quos
        iste error labore blanditiis? Voluptates temporibus repellat excepturi
        beatae ipsa distinctio, quae magnam modi dolor animi ratione provident
        sunt totam consectetur explicabo rem dolores dicta voluptatibus. Rem,
        veritatis ipsam voluptatem soluta deleniti et nisi velit eum unde rerum
        facere distinctio delectus consequatur ex libero praesentium eaque qui
        ratione aliquam, est corrupti, voluptatum vero error illo. Fuga hic
        aliquam voluptas laborum, nisi assumenda labore?
      </CustomText>
    </Row>
  );

  const Header = () => {
    return (
      <Col paddingHorizontal={15} paddingBottom={16}>
        <Row>
          <Row justify={'flex-start'} align={'center'}>
            <LeftArrow marginRight={15} onPress={() => navigation.goBack()} />
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={16}
              top={1}
              fontFamily={fonts.PoppinsMedium}
            >
              About us
            </CustomText>
          </Row>
        </Row>
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <FlatList
          data={[1]}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => setRefetch(true)}
          contentContainerStyle={{
            marginHorizontal: 15,
            paddingBottom: 20,
            flexGrow: 1,
          }}
        />
      </>
    );
  };

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
        }}
        bgColor={COLORS.mainBg}
      >
        <Header />
        <PageContent />
      </SafeAreaWrap>
    </>
  );
};

export default AboutUs;

const styles = StyleSheet.create({});
